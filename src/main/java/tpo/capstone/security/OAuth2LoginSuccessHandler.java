package tpo.capstone.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.service.UserAccountService;
import tpo.capstone.security.JwtTokenProvider;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserAccountService userAccountService;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${app.oauth2.redirectUri:/}") // 리다이렉트 URL을 환경설정에서 가져옴
    private String redirectUri;

    public OAuth2LoginSuccessHandler(UserAccountService userAccountService, JwtTokenProvider jwtTokenProvider) {
        this.userAccountService = userAccountService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User oAuth2User = oauthToken.getPrincipal();

            // 소셜 로그인 사용자 처리 (DB에 저장 또는 업데이트)
            UserAccount userAccount = userAccountService.processOAuthPostLogin(oAuth2User);

            // CustomUserDetails 객체 생성
            CustomUserDetails userDetails = new CustomUserDetails(userAccount);

            // JWT 토큰 생성
            String jwt = jwtTokenProvider.createToken(userDetails);

            // 응답 헤더에 JWT 토큰 추가
            response.addHeader("Authorization", "Bearer " + jwt);

            // JSON 응답으로 토큰 반환 (선택 사항)
            response.setContentType("application/json");
            response.getWriter().write("{\"token\": \"" + jwt + "\"}");
            response.getWriter().flush();

            // 로그인 성공 후 리다이렉트
            response.sendRedirect(redirectUri);
        }
    }
}