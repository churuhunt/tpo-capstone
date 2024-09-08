package tpo.capstone.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tpo.capstone.entity.Post;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // 카테고리로 필터링된 게시물 찾기 (페이징 포함)
    Page<Post> findByCategory(String category, Pageable pageable);

    // 제목에 검색어가 포함된 게시물 찾기 (페이징 포함)
    Page<Post> findByTitleContaining(String searchTerm, Pageable pageable);

    // 카테고리와 제목 모두 필터링된 게시물 찾기 (페이징 포함)
    Page<Post> findByCategoryAndTitleContaining(String category, String searchTerm, Pageable pageable);

    // 추천수가 10 이상인 게시물 찾기
    List<Post> findByLikesGreaterThanEqual(int likes);
}
