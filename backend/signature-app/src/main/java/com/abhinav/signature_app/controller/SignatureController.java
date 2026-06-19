package com.abhinav.signature_app.controller;

import com.abhinav.signature_app.dto.SignatureRequest;
import com.abhinav.signature_app.model.Signature;
import com.abhinav.signature_app.service.JwtService;
import com.abhinav.signature_app.service.SignatureService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/signatures")
public class SignatureController {

    private final SignatureService signatureService;
    private final JwtService jwtService;

    public SignatureController(
            SignatureService signatureService,
            JwtService jwtService
    ) {
        this.signatureService = signatureService;
        this.jwtService = jwtService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Signature> upload(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) throws IOException {

        String authHeader =
                request.getHeader("Authorization");

        String token =
                authHeader.substring(7);

        String email =
                jwtService.extractEmail(token);

        return ResponseEntity.ok(
                signatureService.uploadSignature(
                        file,
                        email
                )
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<Signature>> getMySignatures(
            HttpServletRequest request
    ) {

        String authHeader =
                request.getHeader("Authorization");

        String token =
                authHeader.substring(7);

        String email =
                jwtService.extractEmail(token);

        return ResponseEntity.ok(
                signatureService.getMySignatures(email)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSignature(
            @PathVariable Long id,
            HttpServletRequest request
    ) {

        String authHeader =
                request.getHeader("Authorization");

        String token =
                authHeader.substring(7);

        String email =
                jwtService.extractEmail(token);

        signatureService.deleteSignature(
                id,
                email
        );

        return ResponseEntity.ok(
                "Signature deleted"
        );
    }
    @PostMapping("/create")
    public ResponseEntity<Signature> createSignature(
            @RequestBody SignatureRequest request,
            HttpServletRequest httpRequest
    ) {

        String authHeader =
                httpRequest.getHeader("Authorization");

        String token =
                authHeader.substring(7);

        String email =
                jwtService.extractEmail(token);

        Signature signature =
                signatureService.createSignature(
                        email,
                        request.getText(),
                        request.getImage(),
                        request.getType()
                );

        return ResponseEntity.ok(signature);
    }
}