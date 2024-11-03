package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.Block;
import tpo.capstone.entity.UserAccount;
import java.util.Optional;
import java.util.List;

public interface BlockRepository extends JpaRepository<Block, Long> {

    // 차단 정보 확인
    boolean existsByBlockerAndBlocked(UserAccount blocker, UserAccount blocked);

    // 차단 해제
    void deleteByBlockerAndBlocked(UserAccount blocker, UserAccount blocked);

    // 특정 사용자가 다른 특정 사용자를 차단했는지 확인 (ID 기반)
    Optional<Block> findByBlockerAndBlocked(UserAccount blocker, UserAccount blocked);

    // 특정 사용자가 차단한 모든 사용자 리스트 조회
    List<Block> findByBlocker(UserAccount blocker);

    // 특정 사용자가 다른 사용자를 차단했는지 여부 확인 (ID 기반)
    boolean existsByBlocker_IdAndBlocked_Id(Long blockerId, Long blockedId);
}
