package tpo.capstone.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.Follow;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.FollowRepository;
import tpo.capstone.repository.UserAccountRepository;
import tpo.capstone.security.JwtTokenProvider;

@Slf4j
@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final UserAccountRepository userAccountRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public FollowService(FollowRepository followRepository, UserAccountRepository userAccountRepository, JwtTokenProvider jwtTokenProvider) {
        this.followRepository = followRepository;
        this.userAccountRepository = userAccountRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * 사용자 팔로우
     * @param jwtToken JWT 토큰에서 사용자 ID를 추출
     * @param followingId 팔로우할 대상 사용자 ID
     */
    public void follow(String jwtToken, Long followingId) {
        String userId = jwtTokenProvider.getUsernameFromToken(jwtToken); // JWT에서 사용자 ID 추출
        UserAccount follower = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.error("사용자를 찾을 수 없습니다. ID: {}", userId);
                    return new RuntimeException("사용자를 찾을 수 없습니다.");
                });
        UserAccount following = userAccountRepository.findById(followingId)
                .orElseThrow(() -> {
                    log.error("팔로우할 사용자를 찾을 수 없습니다. ID: {}", followingId);
                    return new RuntimeException("팔로우할 사용자를 찾을 수 없습니다.");
                });

        // 본인 팔로우 방지
        if (follower.equals(following)) {
            log.warn("자기 자신을 팔로우할 수 없습니다. ID: {}", userId);
            throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
        }

        // 중복 팔로우 방지
        if (followRepository.existsByFollowerAndFollowing(follower, following)) {
            log.warn("이미 팔로우 중입니다. Follower ID: {}, Following ID: {}", userId, followingId);
            throw new IllegalArgumentException("이미 팔로우 중입니다.");
        }

        followRepository.save(new Follow(follower, following));
        log.info("사용자 {}가 {}를 팔로우했습니다.", userId, followingId);
    }


    /**
     * 사용자 언팔로우
     * @param jwtToken JWT 토큰에서 사용자 ID를 추출
     * @param followingId 언팔로우할 대상 사용자 ID
     */
    public void unfollow(String jwtToken, Long followingId) {
        String userId = jwtTokenProvider.getUsernameFromToken(jwtToken);  // JWT에서 사용자 ID 추출
        UserAccount follower = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.error("사용자를 찾을 수 없습니다. ID: {}", userId);
                    return new RuntimeException("사용자를 찾을 수 없습니다.");
                });
        UserAccount following = userAccountRepository.findById(followingId)
                .orElseThrow(() -> {
                    log.error("언팔로우할 사용자를 찾을 수 없습니다. ID: {}", followingId);
                    return new RuntimeException("언팔로우할 사용자를 찾을 수 없습니다.");
                });

        Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> {
                    log.error("팔로우 관계가 없습니다. Follower ID: {}, Following ID: {}", userId, followingId);
                    return new RuntimeException("팔로우 관계가 없습니다.");
                });
        followRepository.delete(follow);
        log.info("사용자 {}가 {}를 언팔로우했습니다.", userId, followingId);
    }
}