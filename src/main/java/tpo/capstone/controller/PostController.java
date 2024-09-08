package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.entity.Post;
import tpo.capstone.service.PostService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostService postService;

    // 인기 게시물 (추천수가 10 이상) 가져오기
    @GetMapping("/posts/popular")
    public List<Post> getPopularPosts() {
        return postService.getPopularPosts();
    }

    // 카테고리 및 검색어로 게시물 필터링 (페이징 포함)
    @GetMapping("/posts")
    public Page<Post> getFilteredPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "date") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return postService.getFilteredPosts(category, searchTerm, pageable);
    }

    // 게시물 작성
    @PostMapping("/posts")
    public Post createPost(@RequestBody Post post) {
        return postService.savePost(post);
    }
}

