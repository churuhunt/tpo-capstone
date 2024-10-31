package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.UserSettings;

import java.util.Optional;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    // 특정 사용자의 설정을 찾는 메서드 추가
    Optional<UserSettings> findByUser(UserAccount user);
}