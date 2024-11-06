package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.UserAccount;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserAccountService userAccountService;

    @Autowired
    public CustomOAuth2UserService(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // Kakao 사용자 정보 처리
        if ("kakao".equals(registrationId)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            if (kakaoAccount != null) {
                attributes = kakaoAccount;
                Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
                if (profile != null) {
                    attributes.put("nickname", profile.get("nickname"));
                }
            }
        }

        // 사용자 정보를 처리하고 DB에 저장
        UserAccount userAccount = userAccountService.processOAuthPostLogin(oAuth2User);

        // 사용자 정보를 기반으로 새로운 OAuth2User 반환
        return new DefaultOAuth2User(
                userAccount.getAuthorities(),
                attributes,
                "email" // 사용자의 key 속성 설정 (ex: email)
        );
    }
}