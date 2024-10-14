package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tpo.capstone.entity.UserAccount;

import java.util.List;
import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

    Optional<UserAccount> findByUserId(String userId);  // 기존 메서드

    Optional<UserAccount> findByEmail(String email);    // 이메일로 사용자 검색

    Optional<UserAccount> findByNickname(String nickname);  // 닉네임 중복 확인

    // 전체 누적 포인트 기준으로 상위 사용자 목록 조회
    @Query("SELECT u FROM UserAccount u ORDER BY u.points DESC")
    List<UserAccount> findTopRankings();

    // 주간 누적 포인트 기준으로 상위 사용자 목록 조회
    @Query("SELECT u FROM UserAccount u WHERE u.lastActiveDate BETWEEN :startDate AND :endDate ORDER BY u.points DESC")
    List<UserAccount> findWeeklyTopRankings(String startDate, String endDate);

    // 월간 누적 포인트 기준으로 상위 사용자 목록 조회
    @Query("SELECT u FROM UserAccount u WHERE u.lastActiveDate BETWEEN :startDate AND :endDate ORDER BY u.points DESC")
    List<UserAccount> findMonthlyTopRankings(String startDate, String endDate);
}
