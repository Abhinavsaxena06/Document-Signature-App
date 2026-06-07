package com.abhinav.signature_app.controller;
import com.abhinav.signature_app.model.User;
import com.abhinav.signature_app.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.saveUser(user);
    }
    @GetMapping("/users")
    public List<User> getAllUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email
    ) {
        return userService.getAllUsers(name, email);
    }
}