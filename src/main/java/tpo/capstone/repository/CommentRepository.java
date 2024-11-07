package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tpo.capstone.entity.Comment;
import tpo.capstone.entity.Post;

import java.util.List;


public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPost(Post post);  // 게시물에 해당하는 댓글을 조회하는 메서드


    // 특정 사용자가 작성한 댓글 수
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.author.id = :userId")
    long countByAuthor_Id(@Param("userId") Long userId);
}
