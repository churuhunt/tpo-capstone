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

    @Autowired
    private VisitorRepository visitorRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    // 방문자 추가 로직
    public void addVisitor(Long userId, String visitorUsername) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));

        Visitor visitor = new Visitor(user, visitorUsername);
        visitorRepository.save(visitor);
    }

    // 특정 사용자의 방문자 수 조회 로직
    public long getVisitorCount(Long userId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));

        return visitorRepository.countByUser(user);
    }
}