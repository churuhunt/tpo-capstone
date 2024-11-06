package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.UserSettings;

import java.util.Optional;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {

    /**
     * 특정 UserAccount에 대한 UserSettings를 찾는 메서드
     *
     * @param userAccount - UserAccount 객체
     * @return 해당 UserAccount에 매핑된 UserSettings를 Optional로 반환
     */
    Optional<UserSettings> findByUser(UserAccount userAccount);
}