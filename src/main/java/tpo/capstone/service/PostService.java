package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.Report;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.PostRepository;
import tpo.capstone.repository.ReportRepository;
import tpo.capstone.repository.UserAccountRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private ReportRepository reportRepository;

    // 게시물 저장 및 포인트 업데이트
    @Transactional
    public Post savePost(Post post, String userId) {
        Post savedPost = postRepository.save(post); // 게시물 저장

        // 글 작성한 사용자 포인트 업데이트
        Optional<UserAccount> optionalUser = userAccountRepository.findByUserId(userId);
        if (optionalUser.isPresent()) {
            UserAccount user = optionalUser.get();
            user.setPoints(user.getPoints() + 10); // 글 작성 시 10포인트 증가
            userAccountRepository.save(user); // 사용자 정보 업데이트
        }

        return savedPost;
    }

    // 추천 기능 추가
    @Transactional
    public void likePost(Long postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId"));

        // 사용자가 이미 추천했는지 확인
        if (!post.getLikedUsers().contains(userId)) {
            post.setLikes(post.getLikes() + 1); // 추천 수 1 증가
            post.getLikedUsers().add(userId); // 추천한 사용자 목록에 추가
            postRepository.save(post);
        }
    }

    // 비추천 기능 추가
    @Transactional
    public void dislikePost(Long postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId"));

        // 사용자가 이미 비추천했는지 확인
        if (!post.getDislikedUsers().contains(userId)) {
            post.setDislikes(post.getDislikes() + 1); // 비추천 수 1 증가
            post.getDislikedUsers().add(userId); // 비추천한 사용자 목록에 추가

            // 비추천이 10 이상이면 게시글을 블라인드 처리
            if (post.getDislikes() >= 10) {
                post.setBlind(true);
            }

            postRepository.save(post);
        }
    }

    // 게시글 조회 메서드
    public Post getPost(Long postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId"));

        // 블라인드 처리된 게시글의 경우 프론트엔드에서 추가 확인을 요구할 수 있음
        if (post.isBlind()) {
            // 프론트엔드에서 "블라인드 게시글입니다. 확인하시겠습니까?" 로직으로 처리
        }

        return post;
    }

    // 추천수가 10 이상인 게시물 가져오기 (Popularity.js에서 사용)
    public List<Post> getPopularPosts() {
        return postRepository.findByLikesGreaterThanEqual(10);
    }

    // 카테고리 및 검색어에 따라 필터링된 게시물 가져오기 (페이징 포함)
    public Page<Post> getFilteredPosts(String category, String searchTerm, Pageable pageable) {
        if (category != null && searchTerm != null) {
            return postRepository.findByCategoryAndTitleContaining(category, searchTerm, pageable);
        } else if (category != null) {
            return postRepository.findByCategory(category, pageable);
        } else if (searchTerm != null) {
            return postRepository.findByTitleContaining(searchTerm, pageable);
        } else {
            return postRepository.findAll(pageable);
        }


    }

    // 신고 처리 메서드
    public void reportPost (Long postId, String userId, String reason){
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId"));

        // 신고 기록 저장
        Report report = Report.builder()
                .reporter(userId)
                .targetType("POST")
                .targetId(postId)
                .reason(reason)  // 신고 사유 저장
                .reportedAt(new Date())
                .build();

        reportRepository.save(report);
    }
}