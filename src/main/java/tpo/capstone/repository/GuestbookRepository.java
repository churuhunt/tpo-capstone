package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tpo.capstone.entity.GuestbookComment;

@Repository
public interface GuestbookRepository extends JpaRepository<GuestbookComment, Long> {
}

