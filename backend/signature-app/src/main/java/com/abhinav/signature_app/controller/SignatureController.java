package com.abhinav.signature_app.controller;

import com.abhinav.signature_app.model.Signature;
import com.abhinav.signature_app.service.SignatureService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/signatures")
public class SignatureController {

    private final SignatureService signatureService;

    public SignatureController(
            SignatureService signatureService
    ) {
        this.signatureService = signatureService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Signature> upload(
            @RequestParam("file")
            MultipartFile file,
            Authentication authentication
    ) throws IOException {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                signatureService.uploadSignature(
                        file,
                        email
                )
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<Signature>> getMySignatures(
            Authentication authentication
    ) {

        String email =
                authentication.getName();

        return ResponseEntity.ok(
                signatureService.getMySignatures(email)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSignature(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email =
                authentication.getName();

        signatureService.deleteSignature(
                id,
                email
        );

        return ResponseEntity.ok(
                "Signature deleted"
        );
    }
}