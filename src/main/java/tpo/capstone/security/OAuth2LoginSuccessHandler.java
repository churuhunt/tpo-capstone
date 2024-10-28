package tpo.capstone.security;

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

    public OAuth2LoginSuccessHandler(UserAccountService userAccountService, JwtTokenProvider jwtTokenProvider) {
        this.userAccountService = userAccountService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User oAuth2User = oauthToken.getPrincipal();

            // 소셜 로그인 사용자 처리 (DB에 저장 및 사용자 정보 반환)
            UserAccount userAccount = userAccountService.processOAuthPostLogin(oAuth2User);

            // JWT 토큰 생성
            String jwt = jwtTokenProvider.createToken(new CustomUserDetails(userAccount)); // CustomUserDetails로 변환하여 JWT 생성
            response.addHeader("Authorization", "Bearer " + jwt);

            // 로그인 성공 후 페이지로 리다이렉트
            response.sendRedirect("/");
        }
    }
}