package com.abhinav.signature_app.repository;
import com.abhinav.signature_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}