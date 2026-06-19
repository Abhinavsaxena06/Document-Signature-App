package com.abhinav.signature_app.service;

import com.abhinav.signature_app.model.Document;
import com.abhinav.signature_app.model.DocumentStatus;
import com.abhinav.signature_app.model.Signature;
import com.abhinav.signature_app.model.User;
import com.abhinav.signature_app.repository.DocumentRepository;
import com.abhinav.signature_app.repository.SignatureRepository;
import com.abhinav.signature_app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final SignatureRepository signatureRepository;
    private final PdfSigningService pdfSigningService;

    public DocumentService(
            DocumentRepository documentRepository,
            UserRepository userRepository,
            SignatureRepository signatureRepository,
            PdfSigningService pdfSigningService
    ) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.signatureRepository = signatureRepository;
        this.pdfSigningService = pdfSigningService;
    }

    // ---------------- UPLOAD ----------------
    public Document uploadFile(MultipartFile file, String email) throws IOException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String uploadDir = "C:/uploads";
        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        String filePath = uploadDir + File.separator + uniqueFileName;

        file.transferTo(new File(filePath));

        Document document = new Document();
        document.setFileName(file.getOriginalFilename());
        document.setFilePath(filePath);
        document.setFileType(file.getContentType());
        document.setOwner(user);
        document.setStatus(DocumentStatus.DRAFT);
        document.setCreatedAt(LocalDateTime.now());

        return documentRepository.save(document);
    }

    // ---------------- GET DOCS ----------------
    public List<Document> getMyDocuments(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return documentRepository.findByOwner(user);
    }

    // ---------------- SIGN DOCUMENT ----------------
    public Document signDocument(
            Long documentId,
            Long signatureId,
            int pageNumber,
            float x,
            float y,
            float width,
            float height,
            String email
    ) throws IOException {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        Signature signature = signatureRepository.findById(signatureId)
                .orElseThrow(() -> new RuntimeException("Signature not found"));

        if (!document.getOwner().getEmail().equals(email)) {
            throw new RuntimeException("You do not own this document");
        }

        if (!signature.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You do not own this signature");
        }

        System.out.println("SIGNATURE ID = " + signature.getId());
        System.out.println("TYPE = " + signature.getType());
        System.out.println("TEXT = " + signature.getText());
        System.out.println("PATH = " + signature.getSignaturePath());

        String signedPdfPath = pdfSigningService.signPdf(
                document,
                signature,
                pageNumber,
                x,
                y,
                width,
                height
        );

        document.setSignedFilePath(signedPdfPath);
        document.setStatus(DocumentStatus.COMPLETED);

        return documentRepository.save(document);
    }

    // ---------------- GET SINGLE DOC ----------------
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    // ---------------- DELETE ----------------
    public void deleteDocument(Long id) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        documentRepository.delete(document);
    }
}