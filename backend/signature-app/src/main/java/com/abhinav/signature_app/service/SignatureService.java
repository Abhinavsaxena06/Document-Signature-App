package com.abhinav.signature_app.service;

import com.abhinav.signature_app.model.Signature;
import com.abhinav.signature_app.model.SignatureType;
import com.abhinav.signature_app.model.User;
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
public class SignatureService {

    private final SignatureRepository signatureRepository;
    private final UserRepository userRepository;

    public SignatureService(
            SignatureRepository signatureRepository,
            UserRepository userRepository
    ) {
        this.signatureRepository = signatureRepository;
        this.userRepository = userRepository;
    }

    public Signature uploadSignature(
            MultipartFile file,
            String email
    ) throws IOException {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String uploadDir = "C:/signatures";

        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String uniqueName =
                UUID.randomUUID()
                        + "_"
                        + file.getOriginalFilename();

        String filePath =
                uploadDir
                        + File.separator
                        + uniqueName;

        file.transferTo(new File(filePath));

        Signature signature =
                new Signature();

        signature.setUser(user);
        signature.setSignaturePath(filePath);
        signature.setType(SignatureType.UPLOADED);
        signature.setCreatedAt(LocalDateTime.now());

        return signatureRepository.save(signature);
    }

    public List<Signature> getMySignatures(
            String email
    ) {

        System.out.println("EMAIL = " + email);

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        System.out.println("USER ID = " + user.getId());

        List<Signature> signatures =
                signatureRepository.findByUser(user);

        System.out.println("COUNT = " + signatures.size());

        return signatures;
    }

    public void deleteSignature(
            Long id,
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Signature signature =
                signatureRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Signature not found"));

        if (!signature.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        signatureRepository.delete(signature);
    }
    public void deleteSignature(Long id) {

        Signature signature =
                signatureRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Signature not found"));

        signatureRepository.delete(signature);
    }
    public Signature createSignature(
            String email,
            String text,
            String image,
            String type
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Signature signature = new Signature();

        signature.setUser(user);

        signature.setCreatedAt(LocalDateTime.now());

        if ("typed".equalsIgnoreCase(type)) {

            signature.setType(SignatureType.TYPED);

            signature.setText(text);

        } else {

            signature.setType(SignatureType.DRAWN);

            signature.setImageBase64(image);
        }

        return signatureRepository.save(signature);
    }
}