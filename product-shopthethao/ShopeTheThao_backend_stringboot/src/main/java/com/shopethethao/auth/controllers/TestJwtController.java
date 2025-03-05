// package com.shopethethao.auth.controllers;

// import java.util.HashMap;
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.*;

// import com.shopethethao.auth.security.jwt.util.JwtUtils;
// import com.shopethethao.auth.payload.response.MessageResponse;

// @RestController
// @RequestMapping("/api/test")
// public class TestJwtController {

//     @Autowired
//     private JwtUtils jwtUtils;

//     @GetMapping("/token-info")
//     public ResponseEntity<?> getTokenInfo(@RequestHeader("Authorization") String authHeader) {
//         try {
//             if (authHeader != null && authHeader.startsWith("Bearer ")) {
//                 String token = authHeader.substring(7);
//                 boolean isValid = jwtUtils.validateJwtToken(token);
//                 String username = jwtUtils.getUserNameFromJwtToken(token);
                
//                 return ResponseEntity.ok(new MessageResponse(
//                     String.format("Token valid: %s, Username: %s", isValid, username)
//                 ));
//             }
//             return ResponseEntity.badRequest().body(new MessageResponse("No token provided"));
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
//         }
//     }

//     @GetMapping("/debug-token")
//     public ResponseEntity<?> debugToken(@RequestHeader("Authorization") String authHeader) {
//         try {
//             if (authHeader != null && authHeader.startsWith("Bearer ")) {
//                 String token = authHeader.substring(7);
                
//                 // Log thông tin debug
//                 jwtUtils.debugSecretKey();
                
//                 // Thử parse token
//                 String username = jwtUtils.getUserNameFromJwtToken(token);
//                 boolean isValid = jwtUtils.validateJwtToken(token);
                
//                 return ResponseEntity.ok(Map.of(
//                     "token_valid", isValid,
//                     "username", username,
//                     "token_length", token.length()
//                 ));
//             }
//             return ResponseEntity.badRequest().body("No token provided");
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body("Error: " + e.getMessage());
//         }
//     }

//     @GetMapping("/token-debug")
//     public ResponseEntity<?> tokenDebug(@RequestHeader("Authorization") String authHeader) {
//         try {
//             if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                 return ResponseEntity.badRequest().body("Invalid Authorization header");
//             }

//             String token = authHeader.substring(7);
//             Map<String, Object> debugInfo = new HashMap<>();
//             debugInfo.put("tokenLength", token.length());
            
//             try {
//                 String username = jwtUtils.getUserNameFromJwtToken(token);
//                 debugInfo.put("parsedUsername", username);
//             } catch (Exception e) {
//                 debugInfo.put("parseError", e.getMessage());
//             }
            
//             return ResponseEntity.ok(debugInfo);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body("Debug error: " + e.getMessage());
//         }
//     }

//     @GetMapping("/public")
//     public ResponseEntity<?> publicAccess() {
//         return ResponseEntity.ok(new MessageResponse("Public Content."));
//     }

//     @GetMapping("/protected")
//     @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
//     public ResponseEntity<?> protectedAccess() {
//         return ResponseEntity.ok(new MessageResponse("Protected Content."));
//     }
// }
