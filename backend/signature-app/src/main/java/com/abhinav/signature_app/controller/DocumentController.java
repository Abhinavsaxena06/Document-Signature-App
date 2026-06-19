package com.abhinav.signature_app.controller;

import com.abhinav.signature_app.dto.SignDocumentRequest;
import com.abhinav.signature_app.model.Document;
import com.abhinav.signature_app.service.DocumentService;
import com.abhinav.signature_app.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final JwtService jwtService;

    public DocumentController(
            DocumentService documentService,
            JwtService jwtService
    ) {
        this.documentService = documentService;
        this.jwtService = jwtService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Document> upload(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) throws IOException {

        String authHeader =
                request.getHeader("Authorization");

        String token =
                authHeader.substring(7);

        String email =
                jwtService.extractEmail(token);

        Document document =
                documentService.uploadFile(
                        file,
                        email
                );

        return ResponseEntity.ok(document);
    }

    @GetMapping("/my-documents")
    public ResponseEntity<?> getMyDocuments(
            HttpServletRequest request
    ) {

        String authHeader =
                request.getHeader("Authorization");

        String token =
                authHeader.substring(7);

        String email =
                jwtService.extractEmail(token);

        return ResponseEntity.ok(
                documentService.getMyDocuments(email)
        );
    }

    @PostMapping("/sign")
    public ResponseEntity<Document> signDocument(
            @RequestBody SignDocumentRequest request,
            HttpServletRequest httpRequest
    ) throws IOException {

        String authHeader =
                httpRequest.getHeader("Authorization");

        String token =
                authHeader.substring(7);

        String email =
                jwtService.extractEmail(token);

        Document document =
                documentService.signDocument(
                        request.getDocumentId(),
                        request.getSignatureId(),
                        request.getPageNumber(),
                        request.getX(),
                        request.getY(),
                        request.getWidth(),
                        request.getHeight(),
                        email
                );

        return ResponseEntity.ok(document);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable Long id
    ) throws Exception {

        Document document =
                documentService.getDocumentById(id);

        String path = document.getSignedFilePath();

        if (path == null || path.isEmpty()) {
            path = document.getFilePath();
        }

        File file = new File(path);

        Resource resource =
                new UrlResource(file.toURI());

        return ResponseEntity.ok()
                .header(
                        "Content-Disposition",
                        "attachment; filename=\"" +
                                file.getName() +
                                "\""
                )
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(
            @PathVariable Long id
    ) {

        documentService.deleteDocument(id);

        return ResponseEntity.ok(
                "Document deleted"
        );
    }
}