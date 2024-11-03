package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tpo.capstone.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 특정 사용자가 작성한 댓글 수
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.author.id = :userId")
    long countByAuthor_Id(@Param("userId") Long userId);
}
