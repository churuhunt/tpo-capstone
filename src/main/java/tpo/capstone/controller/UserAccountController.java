package tpo.capstone.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;
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
import tpo.capstone.dto.UserSummaryDTO;
import tpo.capstone.entity.Block;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.entity.UserSettings;
import tpo.capstone.service.BlockService;
import tpo.capstone.service.UserAccountService;
import tpo.capstone.security.JwtTokenProvider;
import tpo.capstone.service.UserSettingsService;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
public class UserAccountController {

    private final UserAccountService userAccountService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final BlockService blockService;
    private final UserSettingsService userSettingsService;

    @Autowired
    public UserAccountController(UserAccountService userAccountService, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, BlockService blockService, UserSettingsService userSettingsService) {
        this.userAccountService = userAccountService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.blockService = blockService;
        this.userSettingsService = userSettingsService;
    }

    // 회원가입 처리
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody UserAccountRequest userAccountRequest) {
        if (userAccountService.isUserIdExists(userAccountRequest.getUserId())) {
            return ResponseEntity.status(409).body("아이디가 이미 존재합니다.");
        }
        userAccountService.join(userAccountRequest);
        log.info("회원가입 성공: {}", userAccountRequest);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    // 특정 사용자 정보 조회
    @GetMapping("/users/{id}")
    public ResponseEntity<UserAccount> getUserAccount(@PathVariable Long id) {
        UserAccount user = userAccountService.getUserAccountById(id);
        return ResponseEntity.ok(user);
    }

    // 로그인 처리 및 JWT 발급
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {
        log.debug("Login request received for userId: {}", loginRequest.getUserId());

        try {
            JwtResponse jwtResponse = userAccountService.login(loginRequest);
            log.debug("Login successful, JWT token generated for userId: {}", loginRequest.getUserId());
            return ResponseEntity.ok(jwtResponse);
        } catch (IllegalArgumentException ex) {
            log.error("Login failed for userId: {}", loginRequest.getUserId(), ex);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new JwtResponse("Invalid login credentials"));
        }
    }

    // 소셜 로그인 처리 및 JWT 발급
    @GetMapping("/oauth2/callback")
    public ResponseEntity<JwtResponse> handleOAuth2Callback(Principal principal) {
        if (principal instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) principal;
            UserAccount user = userAccountService.processOAuthPostLogin(oauthToken.getPrincipal());
            String jwt = jwtTokenProvider.createToken(new CustomUserDetails(user));
            log.info("소셜 로그인 성공: {}", user.getEmail());
            return ResponseEntity.ok(new JwtResponse(jwt));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new JwtResponse("소셜 로그인 실패"));
    }

    // 전체 랭킹 조회
    @GetMapping("/rankings/total")
    public ResponseEntity<List<UserAccount>> getTotalRankings() {
        return ResponseEntity.ok(userAccountService.getTotalRankings());
    }

    // 주간 랭킹 조회
    @GetMapping("/rankings/weekly")
    public ResponseEntity<List<UserAccount>> getWeeklyRankings() {
        return ResponseEntity.ok(userAccountService.getWeeklyRankings());
    }

    // 월간 랭킹 조회
    @GetMapping("/rankings/monthly")
    public ResponseEntity<List<UserAccount>> getMonthlyRankings() {
        return ResponseEntity.ok(userAccountService.getMonthlyRankings());
    }

    // 아이디 중복 체크
    @GetMapping("/check-userId")
    public ResponseEntity<String> checkUserId(@RequestParam String userId) {
        return userAccountService.isUserIdExists(userId) ?
                ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용 중인 아이디입니다.") :
                ResponseEntity.ok("사용 가능한 아이디입니다.");
    }

    // 닉네임 중복 체크
    @GetMapping("/check-nickname")
    public ResponseEntity<String> checkNickname(@RequestParam String nickname) {
        return userAccountService.isNicknameTaken(nickname) ?
                ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용 중인 닉네임입니다.") :
                ResponseEntity.ok("사용 가능한 닉네임입니다.");
    }

    // 특정 userId로 사용자 정보 조회 메서드
    @GetMapping("/users/by-userId/{userId}")
    public ResponseEntity<UserAccount> getUserByUserId(@PathVariable String userId) {
        UserAccount user = userAccountService.getUserByUserId(userId);
        return ResponseEntity.ok(user);
    }



    // 닉네임 클릭 시 사용자 요약 정보 반환
    @GetMapping("/users/{id}/summary")
    public ResponseEntity<UserSummaryDTO> getUserSummary(@PathVariable Long id) {
        UserSummaryDTO userSummary = userAccountService.getUserSummaryById(id);
        return ResponseEntity.ok(userSummary);
    }

    // 사용자 차단
    @PostMapping("/{userId}/block")
    public ResponseEntity<String> blockUser(@PathVariable Long userId, Principal principal) {
        Long blockerId = userAccountService.getUserIdFromPrincipal(principal);
        blockService.blockUser(blockerId, userId);
        return ResponseEntity.ok("사용자가 차단되었습니다.");
    }

    // 차단 해제
    @DeleteMapping("/{userId}/unblock")
    public ResponseEntity<String> unblockUser(@PathVariable Long userId, Principal principal) {
        Long blockerId = userAccountService.getUserIdFromPrincipal(principal);
        blockService.unblockUser(blockerId, userId);
        return ResponseEntity.ok("사용자 차단이 해제되었습니다.");
    }

    // 차단 여부 확인
    @GetMapping("/{userId}/is-blocked")
    public ResponseEntity<Boolean> isUserBlocked(@PathVariable Long userId, Principal principal) {
        Long blockerId = userAccountService.getUserIdFromPrincipal(principal);
        boolean isBlocked = blockService.isBlocked(blockerId, userId);
        return ResponseEntity.ok(isBlocked);
    }

    // 사용자 포인트 조회
    @GetMapping("/users/{id}/points")
    public ResponseEntity<Integer> getUserPoints(@PathVariable Long id) {
        UserAccount user = userAccountService.getUserAccountById(id);
        return ResponseEntity.ok(user.getPoints());
    }

    // 현재 로그인한 사용자의 포인트 조회
    @GetMapping("/user/points")
    public ResponseEntity<Integer> getCurrentUserPoints(Principal principal) {
        String userId = principal.getName();
        UserAccount user = userAccountService.getUserByUserId(userId);
        return ResponseEntity.ok(user.getPoints());
    }

    // 사용자 설정 조회
    @GetMapping("/users/{id}/settings")
    public ResponseEntity<UserSettings> getUserSettings(@PathVariable Long id) {
        UserAccount user = userAccountService.getUserAccountById(id);
        UserSettings settings = userSettingsService.getUserSettings(user);
        return ResponseEntity.ok(settings);
    }

    // 사용자 설정 업데이트
    @PutMapping("/users/{id}/settings")
    public ResponseEntity<String> updateUserSettings(@PathVariable Long id, @RequestBody UserSettings settings) {
        UserAccount user = userAccountService.getUserAccountById(id);
        userSettingsService.updateUserSettings(user, settings);
        return ResponseEntity.ok("User settings updated successfully.");
    }

    // 닉네임 변경 API
    @PutMapping("/settings/nickname")
    public ResponseEntity<String> changeNickname(@RequestParam Long userId, @RequestParam String newNickname) {
        userSettingsService.changeNickname(userId, newNickname);
        return ResponseEntity.ok("닉네임이 변경되었습니다.");
    }

    // 이메일 변경 API
    @PutMapping("/settings/email")
    public ResponseEntity<String> changeEmail(@RequestParam Long userId, @RequestParam String newEmail) {
        userSettingsService.changeEmail(userId, newEmail);
        return ResponseEntity.ok("이메일이 변경되었습니다.");
    }

    // 아이디 변경 API
    @PutMapping("/settings/userId")
    public ResponseEntity<String> changeUserId(@RequestParam Long userId, @RequestParam String newUserId) {
        userSettingsService.changeUserId(userId, newUserId);
        return ResponseEntity.ok("아이디가 변경되었습니다.");
    }

    // 비밀번호 변경 API
    @PutMapping("/settings/password")
    public ResponseEntity<String> changePassword(@RequestParam Long userId,
                                                 @RequestParam String oldPassword,
                                                 @RequestParam String newPassword) {
        userSettingsService.changePassword(userId, oldPassword, newPassword);
        return ResponseEntity.ok("비밀번호가 변경되었습니다.");
    }

    //현재 사용자의 userid
    @GetMapping("/users/current")
    public ResponseEntity<UserAccount> getCurrentUser(Principal principal) {
        String userId = principal.getName();
        UserAccount user = userAccountService.getUserByUserId(userId);
        return ResponseEntity.ok(user);
    }

    // 차단 목록 조회
    @GetMapping("/settings/blocked")
    public ResponseEntity<List<Block>> getBlockedUsers(@RequestParam Long userId) {
        List<Block> blockedUsers = userSettingsService.getBlockedUsers(userId);
        return ResponseEntity.ok(blockedUsers);
    }

    // 차단 추가 API
    @PostMapping("/settings/block")
    public ResponseEntity<String> blockUserInSettings(@RequestParam Long blockerId, @RequestParam Long blockedId) {
        userSettingsService.blockUser(blockerId, blockedId);
        return ResponseEntity.ok("사용자가 차단되었습니다.");
    }

    // 차단 해제 API
    @DeleteMapping("/settings/unblock")
    public ResponseEntity<String> unblockUserInSettings(@RequestParam Long blockerId, @RequestParam Long blockedId) {
        userSettingsService.unblockUser(blockerId, blockedId);
        return ResponseEntity.ok("차단이 해제되었습니다.");
    }
}