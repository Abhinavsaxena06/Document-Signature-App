package com.abhinav.signature_app.service;

import com.abhinav.signature_app.model.Document;
import com.abhinav.signature_app.model.User;
import com.abhinav.signature_app.repository.DocumentRepository;
import com.abhinav.signature_app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public DocumentService(
            DocumentRepository documentRepository,
            UserRepository userRepository
    ) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    public Document uploadFile(
            MultipartFile file,
            String email
    ) throws IOException {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String uploadDir = "C:/uploads";

        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String uniqueFileName =
                UUID.randomUUID()
                        + "_"
                        + file.getOriginalFilename();

        String filePath =
                uploadDir
                        + File.separator
                        + uniqueFileName;

        file.transferTo(
                new File(filePath)
        );

        Document document =
                new Document();

        document.setFileName(
                file.getOriginalFilename()
        );

        document.setFilePath(
                filePath
        );

        document.setFileType(
                file.getContentType()
        );

        document.setOwner(user);

        return documentRepository.save(document);
    }
}