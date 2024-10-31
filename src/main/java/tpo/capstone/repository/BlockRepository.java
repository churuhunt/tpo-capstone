package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.Block;
import tpo.capstone.entity.UserAccount;
import java.util.Optional;
import java.util.List;

public interface BlockRepository extends JpaRepository<Block, Long> {

    boolean existsByBlockerAndBlocked(UserAccount blocker, UserAccount blocked);

    void deleteByBlockerAndBlocked(UserAccount blocker, UserAccount blocked);

    Optional<Block> findByBlocker_IdAndBlocked_Id(Long blockerId, Long blockedId);

    List<Block> findByBlocker_Id(Long blockerId);

    boolean existsByBlocker_IdAndBlocked_Id(Long blockerId, Long blockedId);
}
