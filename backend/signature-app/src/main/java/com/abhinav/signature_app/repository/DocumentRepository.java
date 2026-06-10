package com.abhinav.signature_app.repository;

import com.abhinav.signature_app.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
}