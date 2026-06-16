package com.abhinav.signature_app.service;

import com.abhinav.signature_app.dto.LoginRequest;
import com.abhinav.signature_app.repository.UserRepository;
import com.abhinav.signature_app.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.abhinav.signature_app.model.Role;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
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
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User registerUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setRole(Role.USER); // default role

        return userRepository.save(user);
    }
    public ResponseEntity<String> login(LoginRequest loginRequest) {

        Optional<User> userOptional =
                userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Invalid Email");
        }

        User user = userOptional.get();

        boolean isValid =
                passwordEncoder.matches(
                        loginRequest.getPassword(),
                        user.getPassword()
                );

        if (!isValid) {
            return ResponseEntity.status(401).body("Invalid Password");
        }

        String token =
                jwtService.generateToken(
                        user.getEmail(),
                        user.getRole().name()
                );

        return ResponseEntity.ok(token);
    }
}