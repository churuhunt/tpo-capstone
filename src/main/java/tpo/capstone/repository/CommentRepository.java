package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
