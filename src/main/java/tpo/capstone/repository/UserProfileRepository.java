package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.UserProfile;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserId(Long userId);
}
