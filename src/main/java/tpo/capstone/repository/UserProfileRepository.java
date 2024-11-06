package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.UserProfile;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    /**
     * 특정 UserAccount ID로 UserProfile을 찾는 메서드
     *
     * @return 해당 UserAccount ID에 매핑된 UserProfile을 Optional로 반환
     */
    Optional<UserProfile> findByUser_Id(Long userId);
}