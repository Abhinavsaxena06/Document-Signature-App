    package com.abhinav.signature_app.repository;

    import com.abhinav.signature_app.model.Document;
    import com.abhinav.signature_app.model.User;
    import org.springframework.data.jpa.repository.JpaRepository;

    import java.util.List;

    public interface DocumentRepository extends JpaRepository<Document, Long> {

        List<Document> findByOwner(User owner);
    }