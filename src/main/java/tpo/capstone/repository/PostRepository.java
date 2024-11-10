package tpo.capstone.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tpo.capstone.entity.Post;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // 카테고리로 필터링된 게시물 찾기 (페이징 포함)
    Page<Post> findByCategory(String category, Pageable pageable);

    // 제목에 검색어가 포함된 게시물 찾기 (페이징 포함)
    Page<Post> findByTitleContaining(String searchTerm, Pageable pageable);

    Page<Post> findByCategoryAndSmallCategory(String category, String smallCategory, Pageable pageable);

    // 카테고리와 제목 모두 필터링된 게시물 찾기 (페이징 포함)
    Page<Post> findByCategoryAndTitleContaining(String category, String title, Pageable pageable);

    Page<Post> findByCategoryAndSmallCategoryAndTitleContaining(String category, String smallCategory, String title, Pageable pageable);

    // 추천수가 10 이상인 게시물 찾기
    List<Post> findByLikesGreaterThanEqual(int likes);

    // 날짜 정렬을 위한 메소드
    Page<Post> findByCategoryAndTitleContainingOrderByDateAsc(String category, String searchTerm, Pageable pageable);
    Page<Post> findByCategoryAndTitleContainingOrderByDateDesc(String category, String searchTerm, Pageable pageable);

    // 특정 사용자가 작성한 게시물 목록 조회
    List<Post> findByAuthor_Id(Long authorId);

    // 특정 사용자가 작성한 게시물 목록 조회 (카테고리별)
    List<Post> findByAuthor_IdAndCategory(Long authorId, String category);

    // 특정 사용자가 작성한 게시물의 수
    @Query("SELECT COUNT(p) FROM Post p WHERE p.author.id = :authorId")
    long countByAuthor_Id(@Param("authorId") Long authorId);

    // 특정 사용자가 작성한 게시물의 총 추천 수
    @Query("SELECT SUM(p.likes) FROM Post p WHERE p.author.id = :authorId")
    long countTotalLikesByAuthor_Id(@Param("authorId") Long authorId);

    // 특정 사용자가 작성한 게시물의 총 비추천 수
    @Query("SELECT SUM(p.dislikes) FROM Post p WHERE p.author.id = :authorId")
    long countTotalDislikesByAuthor_Id(@Param("authorId") Long authorId);

    // 여러 카테고리를 필터링하는 메서드 추가
    Page<Post> findByCategoryIn(List<String> category, Pageable pageable);
    Page<Post> findByCategoryInAndTitleContaining(List<String> category, String title, Pageable pageable);
    Page<Post> findByCategoryInAndSmallCategory(List<String> category, String smallCategory, Pageable pageable);
    Page<Post> findByCategoryInAndSmallCategoryAndTitleContaining(List<String> category, String smallCategory, String title, Pageable pageable);

    // likedUsers와 dislikedUsers 정보를 함께 가져오는 쿼리 추가
    @Query("SELECT p FROM Post p " +
            "LEFT JOIN FETCH p.likedUsers " +
            "LEFT JOIN FETCH p.dislikedUsers " +
            "WHERE p.author.id = :authorId " +
            "AND p.category IN :category " +
            "AND (:searchTerm IS NULL OR p.title LIKE %:searchTerm%)")
    Page<Post> findFilteredPostsByUser(
            @Param("authorId") Long authorId,
            @Param("category") List<String> category,
            @Param("searchTerm") String searchTerm,
            Pageable pageable);
}
