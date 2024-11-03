package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.Visitor;

import java.util.List;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    /**
     * 특정 UserAccount ID에 해당하는 모든 Visitor를 조회
     *
     * @param userAccountId - UserAccount의 ID
     * @return 해당 UserAccount ID에 매핑된 모든 Visitor 목록
     */
    List<Visitor> findByUserAccountId(Long userAccountId);

    /**
     * 특정 UserAccount에 대한 방문자 수를 계산
     *
     * @param userAccount - UserAccount 객체
     * @return 해당 UserAccount의 방문자 수
     */
    long countByUserAccount(UserAccount userAccount);
}
