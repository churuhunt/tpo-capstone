package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.Post;
import tpo.capstone.repository.PostRepository;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // 게시물 저장
    public Post savePost(Post post) {
        return postRepository.save(post);
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
}

