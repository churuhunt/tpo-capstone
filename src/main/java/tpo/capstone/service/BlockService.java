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

    // 차단하기
    @Transactional
    public void blockUser(Long blockerId, Long blockedId) {
        UserAccount blocker = userAccountRepository.findById(blockerId).orElseThrow();
        UserAccount blocked = userAccountRepository.findById(blockedId).orElseThrow();

        if (!blockRepository.existsByBlockerAndBlocked(blocker, blocked)) {
            Block block = new Block(blocker, blocked);
            blockRepository.save(block);
        }
    }

    // 차단 해제
    @Transactional
    public void unblockUser(Long blockerId, Long blockedId) {
        UserAccount blocker = userAccountRepository.findById(blockerId).orElseThrow();
        UserAccount blocked = userAccountRepository.findById(blockedId).orElseThrow();

        blockRepository.deleteByBlockerAndBlocked(blocker, blocked);
    }

    // 차단 여부 확인
    public boolean isBlocked(Long blockerId, Long blockedId) {
        UserAccount blocker = userAccountRepository.findById(blockerId).orElseThrow();
        UserAccount blocked = userAccountRepository.findById(blockedId).orElseThrow();

        return blockRepository.existsByBlockerAndBlocked(blocker, blocked);
    }
}
