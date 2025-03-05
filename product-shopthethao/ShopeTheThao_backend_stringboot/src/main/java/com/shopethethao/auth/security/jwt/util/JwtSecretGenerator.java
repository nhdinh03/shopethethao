package com.shopethethao.auth.security.jwt.util;
import java.util.Base64;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class JwtSecretGenerator {
    public static void main(String[] args) {
        // Tạo key mới cho HS256
        byte[] keyBytes = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();
        String secretKey = Base64.getEncoder().encodeToString(keyBytes);
        
        // System.out.println("Generated JWT Secret Key (Base64):");
        // System.out.println(secretKey);
        // System.out.println("Key length: " + keyBytes.length * 8 + " bits");
    }
}

