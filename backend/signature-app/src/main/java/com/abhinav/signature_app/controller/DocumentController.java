package com.abhinav.signature_app.controller;

import com.abhinav.signature_app.model.Document;
import com.abhinav.signature_app.service.DocumentService;
import com.abhinav.signature_app.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.abhinav.signature_app.dto.SignDocumentRequest;

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
            @RequestBody SignDocumentRequest request
    ) throws IOException {

        Document document =
                documentService.signDocument(
                        request.getDocumentId(),
                        request.getSignatureId(),
                        request.getPageNumber(),
                        request.getX(),
                        request.getY()
                );

        return ResponseEntity.ok(document);
    }
}