package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.Visitor;
import tpo.capstone.repository.UserAccountRepository;
import tpo.capstone.repository.VisitorRepository;

import java.time.LocalDateTime;

@Service
public class VisitorService {

    private final VisitorRepository visitorRepository;
    private final UserAccountRepository userAccountRepository;

    @Autowired
    public VisitorService(VisitorRepository visitorRepository, UserAccountRepository userAccountRepository) {
        this.visitorRepository = visitorRepository;
        this.userAccountRepository = userAccountRepository;
    }

    /**
     * 특정 사용자 프로필에 대한 방문자 기록 추가
     *
     * @param userId 방문할 사용자 ID
     * @param visitorUsername 방문자 이름
     */
    public void addVisitor(Long userId, String visitorUsername) {
        UserAccount user = getUserById(userId);
        Visitor visitor = new Visitor(user, visitorUsername);
        visitorRepository.save(visitor);
    }

    /**
     * 특정 사용자의 방문자 수 조회
     *
     * @param userId 방문자 수를 조회할 사용자 ID
     * @return 방문자 수
     */
    public long getVisitorCount(Long userId) {
        UserAccount user = getUserById(userId);
        return visitorRepository.countByUser(user);
    }

    /**
     * ID로 사용자 조회
     *
     * @param userId 조회할 사용자 ID
     * @return 사용자 계정 정보
     */
    private UserAccount getUserById(Long userId) {
        return userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));
    }
}