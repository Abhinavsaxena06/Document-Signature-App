package com.abhinav.signature_app.repository;

import com.abhinav.signature_app.model.Signature;
import com.abhinav.signature_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SignatureRepository
        extends JpaRepository<Signature, Long> {

    List<Signature> findByUser(User user);
}