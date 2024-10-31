package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.Follow;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.FollowRepository;
import tpo.capstone.repository.UserAccountRepository;
import tpo.capstone.security.JwtTokenProvider;

@Service
public class FollowService {
    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider; // JwtTokenProvider 사용

    public void follow(String jwtToken, Long followingId) {
        String userId = jwtTokenProvider.getUsernameFromToken(jwtToken);  // JWT에서 사용자 ID 추출
        UserAccount follower = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        UserAccount following = userAccountRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("팔로우할 사용자를 찾을 수 없습니다."));

        if (!followRepository.existsByFollowerAndFollowing(follower, following)) {
            Follow follow = new Follow(follower, following);
            followRepository.save(follow);
        }
    }

    public void unfollow(String jwtToken, Long followingId) {
        String userId = jwtTokenProvider.getUsernameFromToken(jwtToken);  // JWT에서 사용자 ID 추출
        UserAccount follower = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        UserAccount following = userAccountRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("언팔로우할 사용자를 찾을 수 없습니다."));

        Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> new RuntimeException("팔로우 관계가 없습니다."));
        followRepository.delete(follow);
    }
}