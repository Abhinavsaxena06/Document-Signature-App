package com.abhinav.signature_app.service;

import com.abhinav.signature_app.repository.UserRepository;
import com.abhinav.signature_app.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers(String name, String email) {
        List<User> users = userRepository.findAll();

        return users.stream()
                .filter(user -> name == null ||
                        user.getName().equalsIgnoreCase(name))
                .filter(user -> email == null ||
                        user.getEmail().equalsIgnoreCase(email))
                .toList();
    }

    public ResponseEntity<User> getUserById(Long id) {

        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.status(404).build());
    }

    public User updateUser(Long id, User updatedUser) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPassword(updatedUser.getPassword());

        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User registerUser(User user) {

        String hashedPassword =
                passwordEncoder.encode(user.getPassword());

        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }
}