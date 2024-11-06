package tpo.capstone.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.Block;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.BlockRepository;
import tpo.capstone.repository.UserAccountRepository;

@Service
public class BlockService {

    private final BlockRepository blockRepository;
    private final UserAccountRepository userAccountRepository;

    @Autowired
    public BlockService(BlockRepository blockRepository, UserAccountRepository userAccountRepository) {
        this.blockRepository = blockRepository;
        this.userAccountRepository = userAccountRepository;
    }

    /**
     * 특정 사용자를 차단하는 메서드
     * @param blockerId 차단을 요청하는 사용자의 ID
     * @param blockedId 차단될 사용자의 ID
     */
    @Transactional
    public void blockUser(Long blockerId, Long blockedId) {
        UserAccount blocker = userAccountRepository.findById(blockerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + blockerId));
        UserAccount blocked = userAccountRepository.findById(blockedId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + blockedId));

        if (!blockRepository.existsByBlockerAndBlocked(blocker, blocked)) {
            Block block = new Block(blocker, blocked);
            blockRepository.save(block);
        }
    }

    /**
     * 특정 사용자의 차단을 해제하는 메서드
     * @param blockerId 차단 해제를 요청하는 사용자의 ID
     * @param blockedId 차단 해제될 사용자의 ID
     */
    @Transactional
    public void unblockUser(Long blockerId, Long blockedId) {
        UserAccount blocker = userAccountRepository.findById(blockerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + blockerId));
        UserAccount blocked = userAccountRepository.findById(blockedId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + blockedId));

        blockRepository.deleteByBlockerAndBlocked(blocker, blocked);
    }

    /**
     * 특정 사용자가 다른 사용자를 차단했는지 여부를 확인하는 메서드
     * @param blockerId 차단 여부를 확인할 사용자 ID
     * @param blockedId 차단 상태를 확인할 대상 사용자 ID
     * @return 차단 여부 (차단되어 있으면 true, 그렇지 않으면 false)
     */
    public boolean isBlocked(Long blockerId, Long blockedId) {
        UserAccount blocker = userAccountRepository.findById(blockerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + blockerId));
        UserAccount blocked = userAccountRepository.findById(blockedId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + blockedId));

        return blockRepository.existsByBlockerAndBlocked(blocker, blocked);
    }
}