package com.vti.AuthService.authen;

import java.util.Date;

import org.bouncycastle.jcajce.BCFKSLoadStoreParameter.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;

@Component
public class JwtUtil {
    private String secret = "mySuperSecretKeyThatIsLongEnoughForHS256Encoding123456";
    // Tạo Secret key.
    // SecretKey secret = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 ngày
                .signWith(io.jsonwebtoken.SignatureAlgorithm.HS256, secret)
                .compact();
    }

    // public String extractUsername(String token) {
    // return Jwts.parser().setSigningKey(secret)
    // .parseClaimsJws(token)
    // .getBody()
    // .getSubject();
    // }

    // public boolean validateToken(String token) {
    // try {
    // Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
    // return true;
    // } catch (Exception e) {
    // return false;
    // }
    // }
}
