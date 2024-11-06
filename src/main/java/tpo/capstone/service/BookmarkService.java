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

    private final BookmarkRepository bookmarkRepository;
    private final UserAccountRepository userAccountRepository;
    private final PostRepository postRepository;

    @Autowired
    public BookmarkService(BookmarkRepository bookmarkRepository, UserAccountRepository userAccountRepository, PostRepository postRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.userAccountRepository = userAccountRepository;
        this.postRepository = postRepository;
    }

    /**
     * 특정 사용자의 북마크된 게시물 목록을 조회
     *
     * @param userId 사용자 ID
     * @return 사용자가 북마크한 게시물 목록
     */
    public List<Post> getBookmarkedPosts(Long userId) {
        return bookmarkRepository.findByUser_Id(userId).stream()
                .map(Bookmark::getPost)
                .collect(Collectors.toList());
    }

    /**
     * 사용자의 특정 게시물 북마크 상태를 토글
     *
     * @param userId 사용자 ID
     * @param postId 게시물 ID
     */
    public void toggleBookmark(Long userId, Long postId) {
        Optional<Bookmark> optionalBookmark = bookmarkRepository.findByUser_IdAndPost_Id(userId, postId);

        if (optionalBookmark.isPresent()) {
            // 북마크가 이미 존재하면 삭제
            bookmarkRepository.delete(optionalBookmark.get());
        } else {
            // 북마크가 없으면 추가
            UserAccount user = userAccountRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
            bookmarkRepository.save(new Bookmark(user, post));
        }
    }
}