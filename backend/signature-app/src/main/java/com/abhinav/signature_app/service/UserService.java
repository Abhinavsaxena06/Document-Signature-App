package com.abhinav.signature_app.service;
import com.abhinav.signature_app.repository.UserRepository;
import com.abhinav.signature_app.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    public List<User> getAllUsers(String name, String email) {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user->name==null || user.getName().equalsIgnoreCase(name))
                .filter(user->email==null || user.getEmail().equalsIgnoreCase(email))
                .toList();
    }
}