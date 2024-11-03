package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.PostRepository;
import tpo.capstone.repository.UserAccountRepository;
import tpo.capstone.service.UserActivityService;

import java.util.Map;

@RestController
@RequestMapping("/api/activity")
public class UserActivityController {

    private final UserActivityService userActivityService;
    private final UserAccountRepository userAccountRepository;
    private final PostRepository postRepository;

    @Autowired
    public UserActivityController(UserActivityService userActivityService, UserAccountRepository userAccountRepository, PostRepository postRepository) {
        this.userActivityService = userActivityService;
        this.userAccountRepository = userAccountRepository;
        this.postRepository = postRepository;
    }

    /**
     * 사용자 활동 기록 API
     *
     * @param payload 사용자 ID, 게시물 ID, 활동 타입을 포함한 요청 본문
     * @return 활동 기록 성공 여부
     */
    @PostMapping("/record")
    public ResponseEntity<String> recordActivity(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            Long postId = Long.valueOf(payload.get("postId").toString());
            String activityType = payload.get("activityType").toString();

            // UserAccount와 Post는 엔티티를 통해 가져옴
            UserAccount user = userAccountRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. ID: " + userId));
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new IllegalArgumentException("게시물을 찾을 수 없습니다. ID: " + postId));

            // 활동 데이터 저장
            userActivityService.saveUserActivity(user, post, activityType);

            return ResponseEntity.ok("Activity recorded");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
}
