package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.Bookmark;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    List<Bookmark> findByUser_Id(Long userId);  // user 필드의 id를 사용하여 조회

    Optional<Bookmark> findByUser_IdAndPost_Id(Long userId, Long postId);  // user와 post의 id로 조회
}