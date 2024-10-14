package tpo.capstone.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.dto.JwtResponse;
import tpo.capstone.dto.LoginRequest;
import tpo.capstone.dto.UserAccountRequest;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.UserAccountRepository;
import tpo.capstone.security.JwtTokenProvider;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserAccountService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserAccountRepository userAccountRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public UserAccountService(BCryptPasswordEncoder bCryptPasswordEncoder, UserAccountRepository userAccountRepository, JwtTokenProvider jwtTokenProvider) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userAccountRepository = userAccountRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // 일반 회원가입 로직
    public void join(UserAccountRequest request) {
        UserAccount user = UserAccount.builder()
                .userId(request.getUserId())
                .password(bCryptPasswordEncoder.encode(request.getPassword())) // 비밀번호 암호화
                .name(request.getName())
                .age(request.getAge())
                .gender(request.getGender())
                .email(request.getEmail())
                .nickname(request.getNickname())
                .build();
        userAccountRepository.save(user);
    }

    // 일반 로그인 로직
    public JwtResponse login(LoginRequest request) {
        UserAccount user = userAccountRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with userId: " + request.getUserId()));

        if (bCryptPasswordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.info("비밀번호가 일치합니다. 로그인 성공: {}", request.getUserId());
            // JWT 토큰 생성
            String token = jwtTokenProvider.createToken(new CustomUserDetails(user)); // CustomUserDetails에서 JWT 토큰을 생성
            return new JwtResponse(token);  // 토큰을 반환
        } else {
            log.warn("비밀번호가 일치하지 않습니다. 로그인 실패: {}", request.getUserId());
            throw new IllegalArgumentException("Invalid credentials");
        }
    }

    // 소셜 로그인 사용자 처리 로직
    public UserAccount processOAuthPostLogin(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // 기존 사용자가 있는지 확인
        Optional<UserAccount> existingUser = userAccountRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser.get(); // 기존 사용자가 있다면 그대로 반환
        }

        // 없으면 새 사용자 생성 및 저장
        UserAccount newUser = UserAccount.builder()
                .userId(email)  // 이메일을 기본 userId로 설정
                .password(null)  // 소셜 로그인의 경우 비밀번호가 없을 수 있음
                .name(name)
                .email(email)
                .build();
        userAccountRepository.save(newUser);
        return newUser;
    }

    // 포인트 추가 메서드
    public void addPoints(UserAccount user, int points) {
        user.setPoints(user.getPoints() + points);
        userAccountRepository.save(user);
    }

    // 포인트 차감 메서드
    public void deductPoints(UserAccount user, int points) {
        user.setPoints(user.getPoints() - points);
        userAccountRepository.save(user);
    }

    // 전체 랭킹
    public List<UserAccount> getTotalRankings() {
        return userAccountRepository.findTopRankings();
    }

    // 주간 랭킹
    public List<UserAccount> getWeeklyRankings() {
        String endDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        String startDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date(System.currentTimeMillis() - (7L * 24 * 60 * 60 * 1000))); // 7일 전
        return userAccountRepository.findWeeklyTopRankings(startDate, endDate);
    }

    // 월간 랭킹
    public List<UserAccount> getMonthlyRankings() {
        String endDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        String startDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date(System.currentTimeMillis() - (30L * 24 * 60 * 60 * 1000))); // 30일 전
        return userAccountRepository.findMonthlyTopRankings(startDate, endDate);
    }

    // 유저 아이디 및 닉네임 중복확인
    public boolean isUserIdExists(String userId) {
        return userAccountRepository.findByUserId(userId).isPresent();
    }

    public boolean isNicknameTaken(String nickname) {
        return userAccountRepository.findByNickname(nickname).isPresent();
    }
}