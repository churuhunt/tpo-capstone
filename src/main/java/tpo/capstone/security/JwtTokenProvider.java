package tpo.capstone.security;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import tpo.capstone.auth.CustomUserDetails;

import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    private final String JWT_SECRET;
    private final long JWT_EXPIRATION;

    public JwtTokenProvider() {
        Dotenv dotenv = Dotenv.configure().load();
        this.JWT_SECRET = dotenv.get("JWT_SECRET");
        this.JWT_EXPIRATION = Long.parseLong(dotenv.get("JWT_EXPIRATION"));
    }

    /**
     * 주어진 사용자 정보로 JWT 토큰을 생성
     * @param userDetails 사용자 세부 정보
     * @return 생성된 JWT 토큰
     */
    public String createToken(CustomUserDetails userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("role", userDetails.getAuthorities()) // 권한 추가
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();
    }

    /**
     * JWT 토큰에서 사용자 이름을 추출
     * @param token JWT 토큰
     * @return 사용자 이름 (주로 사용자 ID)
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(JWT_SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * 주어진 JWT 토큰의 유효성을 검증
     * @param token 검증할 JWT 토큰
     * @return 유효한 경우 true, 그렇지 않으면 false
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(JWT_SECRET).build().parseClaimsJws(token);
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty");
        }
        return false;
    }

    /**
     * JWT 토큰에서 사용자 ID를 추출
     * @param token JWT 토큰
     * @return 사용자 ID (Long 타입으로 변환된 값)
     */
    public Long getUserIdFromToken(String token) {
        String userId = getUsernameFromToken(token);
        try {
            return Long.parseLong(userId);
        } catch (NumberFormatException e) {
            logger.error("User ID is not in numeric format: {}", userId);
            return null; // 또는 적절한 예외를 던질 수 있습니다.
        }
    }

}