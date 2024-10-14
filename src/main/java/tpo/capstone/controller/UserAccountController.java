package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.dto.LoginRequest;
import tpo.capstone.dto.JwtResponse;
import tpo.capstone.dto.UserAccountRequest;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.service.UserAccountService;
import tpo.capstone.security.JwtTokenProvider;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
public class UserAccountController {

    private final UserAccountService userAccountService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public UserAccountController(UserAccountService userAccountService, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.userAccountService = userAccountService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // 회원가입 처리
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserAccountRequest userAccountRequest) {
        if (userAccountService.isUserIdExists(userAccountRequest.getUserId())) {
            return ResponseEntity.status(409).body("아이디가 이미 존재합니다.");
        }
        userAccountService.join(userAccountRequest);
        log.info("회원가입 성공: {}", userAccountRequest);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    // 로그인 처리 및 JWT 발급
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        log.debug("Login request received for userId: {}", loginRequest.getUserId());

        try {
            JwtResponse jwtResponse = userAccountService.login(loginRequest);
            log.debug("Login successful, JWT token generated for userId: {}", loginRequest.getUserId());

            return ResponseEntity.ok(jwtResponse);
        } catch (IllegalArgumentException ex) {
            log.error("Login failed for userId: {}", loginRequest.getUserId(), ex);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login credentials");
        }
    }

    // 소셜 로그인 처리 및 JWT 발급
    @GetMapping("/oauth2/callback")
    public ResponseEntity<?> handleOAuth2Callback(Principal principal) {
        if (principal instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) principal;

            // 소셜 로그인 성공 시 사용자 정보 저장
            UserAccount user = userAccountService.processOAuthPostLogin(oauthToken.getPrincipal());

            // CustomUserDetails 객체로 변환
            CustomUserDetails userDetails = new CustomUserDetails(user);

            // JWT 생성
            String jwt = jwtTokenProvider.createToken(userDetails);
            log.info("소셜 로그인 성공: {}", user.getEmail());

            return ResponseEntity.ok(new JwtResponse(jwt));
        }
        return ResponseEntity.status(401).body("소셜 로그인 실패");
    }

    // 전체 랭킹 조회
    @GetMapping("/rankings/total")
    public List<UserAccount> getTotalRankings() {
        return userAccountService.getTotalRankings();
    }

    // 주간 랭킹 조회
    @GetMapping("/rankings/weekly")
    public List<UserAccount> getWeeklyRankings() {
        return userAccountService.getWeeklyRankings();
    }

    // 월간 랭킹 조회
    @GetMapping("/rankings/monthly")
    public List<UserAccount> getMonthlyRankings() {
        return userAccountService.getMonthlyRankings();
    }

    // 아이디 중복 체크
    @GetMapping("/check-userId")
    public ResponseEntity<?> checkUserId(@RequestParam String userId) {
        boolean isTaken = userAccountService.isUserIdExists(userId);
        if (isTaken) {
            return ResponseEntity.badRequest().body("이미 사용 중인 아이디입니다.");
        }
        return ResponseEntity.ok("사용 가능한 아이디입니다.");
    }

    // 닉네임 중복 체크
    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        boolean isTaken = userAccountService.isNicknameTaken(nickname);
        if (isTaken) {
            return ResponseEntity.badRequest().body("이미 사용 중인 닉네임입니다.");
        }
        return ResponseEntity.ok("사용 가능한 닉네임입니다.");
    }
}