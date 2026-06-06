package com.abhinav.signature_app.service;
import com.abhinav.signature_app.repository.UserRepository;
import com.abhinav.signature_app.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}