/*
package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.LikedPost;

import java.util.List;
import java.util.Optional;

public interface LikedPostRepository extends JpaRepository<LikedPost, Long> {
    // 추가적인 메서드 정의

    //특정 사용자와 게시물에 대한 좋아요 여부 확인
    Optional<LikedPost> findByUserIdAndPostId(Long userId, Long postId);

    //특정 사용자에 의해 좋아요된 모든 게시물 가져오기
    List<LikedPost> findAllByUserId(Long userId);

    //특정 게시물에 대해 좋아요 수 가져오기
    long countByPostId(Long postId);



}*/
