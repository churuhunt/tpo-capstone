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
import tpo.capstone.dto.UserSummaryDTO;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.UserAccountRepository;
import tpo.capstone.security.JwtTokenProvider;
import org.springframework.transaction.annotation.Transactional;
import tpo.capstone.entity.Item;
import tpo.capstone.repository.ItemRepository;


import java.security.Principal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class UserAccountService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserAccountRepository userAccountRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final ItemRepository itemRepository;

    @Autowired
    public UserAccountService(BCryptPasswordEncoder bCryptPasswordEncoder, UserAccountRepository userAccountRepository, JwtTokenProvider jwtTokenProvider, ItemRepository itemRepository) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userAccountRepository = userAccountRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.itemRepository = itemRepository;
    }

    /**
     * 일반 회원가입 로직
     * @param request 회원가입 요청 데이터
     */
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

    /**
     * 특정 사용자 조회 (Lazy Loading 문제 해결을 위해 @Transactional 추가)
     * @param id 사용자 ID
     * @return 사용자 정보
     */
    @Transactional(readOnly = true)
    public UserAccount getUserAccountById(Long id) {
        return userAccountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    /**
     * 일반 로그인 로직
     * @param request 로그인 요청 데이터
     * @return JWT 응답 객체
     */
    public JwtResponse login(LoginRequest request) {
        UserAccount user = userAccountRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with userId: " + request.getUserId()));

        if (bCryptPasswordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.info("비밀번호가 일치합니다. 로그인 성공: {}", request.getUserId());
            String token = jwtTokenProvider.createToken(new CustomUserDetails(user));
            return new JwtResponse(token);
        } else {
            log.warn("비밀번호가 일치하지 않습니다. 로그인 실패: {}", request.getUserId());
            throw new IllegalArgumentException("Invalid credentials");
        }
    }

    /**
     * 소셜 로그인 사용자 처리 로직
     * @param oAuth2User OAuth2 사용자 객체
     * @return 처리된 사용자 정보
     */
    public UserAccount processOAuthPostLogin(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // 이메일과 닉네임 추출
        String email = (String) attributes.get("email");
        String nickname = (String) attributes.getOrDefault("nickname", ""); // 닉네임이 없을 경우 기본값 설정

        Optional<UserAccount> existingUser = userAccountRepository.findByEmail(email);

        // 이미 존재하는 사용자라면 해당 사용자 반환
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        // 존재하지 않는 사용자라면 새로 생성
        UserAccount newUser = UserAccount.builder()
                .userId(email)  // 이메일을 userId로 설정
                .email(email)
                .nickname(nickname)
                .password(null) // 소셜 로그인에서는 비밀번호를 사용하지 않음
                .build();

        return userAccountRepository.save(newUser);
    }

    /**
     * 포인트 추가 메서드
     * @param user 사용자 객체
     * @param points 추가할 포인트
     */
    public void addPoints(UserAccount user, int points) {
        user.setPoints(user.getPoints() + points);
        userAccountRepository.save(user);
    }

    /**
     * 포인트 차감 메서드
     * @param user 사용자 객체
     * @param points 차감할 포인트
     */
    public void deductPoints(UserAccount user, int points) {
        user.setPoints(user.getPoints() - points);
        userAccountRepository.save(user);
    }

    /**
     * 전체 랭킹 조회
     * @return 상위 사용자 목록
     */
    public List<UserAccount> getTotalRankings() {
        return userAccountRepository.findTopRankings();
    }

    /**
     * 주간 랭킹 조회
     * @return 주간 상위 사용자 목록
     */
    public List<UserAccount> getWeeklyRankings() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);
        return userAccountRepository.findWeeklyTopRankings(startDate, endDate);
    }

    /**
     * 월간 랭킹 조회
     * @return 월간 상위 사용자 목록
     */
    public List<UserAccount> getMonthlyRankings() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);
        return userAccountRepository.findMonthlyTopRankings(startDate, endDate);
    }

    /**
     * 유저 아이디 중복 확인
     * @param userId 확인할 사용자 ID
     * @return 중복 여부
     */
    public boolean isUserIdExists(String userId) {
        return userAccountRepository.findByUserId(userId).isPresent();
    }

    /**
     * 닉네임 중복 확인
     * @param nickname 확인할 닉네임
     * @return 중복 여부
     */
    public boolean isNicknameTaken(String nickname) {
        return userAccountRepository.findByNickname(nickname).isPresent();
    }

    /**
     * 특정 userId로 사용자 조회
     * @param userId 사용자 ID
     * @return 사용자 객체
     */
    @Transactional(readOnly = true)
    public UserAccount getUserByUserId(String userId) {
        return userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with userId: " + userId));
    }

    /**
     * 사용자 요약 정보 조회 (닉네임 클릭 시)
     * @param id 사용자 ID
     * @return 사용자 요약 DTO
     */
    public UserSummaryDTO getUserSummaryById(Long id) {
        UserAccount user = getUserAccountById(id);
        return new UserSummaryDTO(user.getNickname(), user.getUserId(), user.getPoints());
    }

    /**
     * 현재 사용자 ID를 Principal에서 가져오는 메서드
     * @param principal Principal 객체
     * @return 사용자 ID
     */
    public Long getUserIdFromPrincipal(Principal principal) {
        String userId = principal.getName();
        UserAccount user = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with userId: " + userId));
        return user.getId();
    }
}