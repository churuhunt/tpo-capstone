package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.UserProfile;
import tpo.capstone.repository.UserProfileRepository;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    /**
     * 특정 사용자의 프로필 조회
     * @param userId 사용자 ID
     * @return 사용자 프로필 정보
     * @throws IllegalArgumentException 사용자 프로필을 찾을 수 없을 때 발생
     */
    @Transactional
    public UserProfile getProfile(Long userId) {
        return userProfileRepository.findByUser_Id(userId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found for ID: " + userId));
    }

    /**
     * 특정 사용자의 프로필 업데이트
     * @param userId 사용자 ID
     * @param updatedProfile 업데이트된 사용자 프로필 정보
     * @return 업데이트된 사용자 프로필
     */
    public UserProfile updateProfile(Long userId, UserProfile updatedProfile) {
        UserProfile userProfile = getProfile(userId);

        // 프로필 정보 업데이트
        userProfile.setProfileImageUrl(updatedProfile.getProfileImageUrl());
        userProfile.setBackgroundImageUrl(updatedProfile.getBackgroundImageUrl());
        userProfile.setNicknameDecoration(updatedProfile.getNicknameDecoration());
        userProfile.setIntroduction(updatedProfile.getIntroduction());
        userProfile.setInterests(updatedProfile.getInterests());

        return userProfileRepository.save(userProfile);
    }
}