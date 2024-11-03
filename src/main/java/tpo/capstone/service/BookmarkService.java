package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.Bookmark;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.BookmarkRepository;
import tpo.capstone.repository.PostRepository;
import tpo.capstone.repository.UserAccountRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private PostRepository postRepository;

    public List<Post> getBookmarkedPosts(Long userId) {
        return bookmarkRepository.findByUserId(userId).stream()
                .map(Bookmark::getPost)
                .collect(Collectors.toList());
    }

    public void toggleBookmark(Long userId, Long postId) {
        Optional<Bookmark> bookmark = bookmarkRepository.findByUserIdAndPostId(userId, postId);
        if (bookmark.isPresent()) {
            bookmarkRepository.delete(bookmark.get());
        } else {
            UserAccount user = userAccountRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new IllegalArgumentException("게시물을 찾을 수 없습니다."));
            bookmarkRepository.save(new Bookmark(user, post));
        }
    }
}
