package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.Visitor;

import java.util.List;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    List<Visitor> findByUser_Id(Long userId);
    long countByUser(UserAccount user);
}
