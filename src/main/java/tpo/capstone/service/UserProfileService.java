package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tpo.capstone.dto.UserProfileRequestDto;
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
     * @param profileDto 업데이트할 프로필 정보
     */
    public UserProfile updateProfileData(Long userId, UserProfileRequestDto profileDto) {
        UserProfile userProfile = getProfile(userId);

        // 프로필 정보 업데이트
        userProfile.setProfileImageUrl(profileDto.getProfileImageUrl());
        userProfile.setBackgroundImageUrl(profileDto.getBackgroundImageUrl());
        userProfile.setNicknameDecoration(profileDto.getNicknameDecoration());
        userProfile.setIntroduction(profileDto.getIntroduction());
        userProfile.setInterests(profileDto.getInterests());

        return userProfileRepository.save(userProfile);
    }

    // 프로필 이미지 URL 업데이트
    public void updateProfileImage(Long userId, String profileImageUrl) {
        UserProfile userProfile = getProfile(userId);
        userProfile.setProfileImageUrl(profileImageUrl);
        userProfileRepository.save(userProfile);
    }

    // 배경 이미지 URL 업데이트
    public void updateBackgroundImage(Long userId, String backgroundImageUrl) {
        UserProfile userProfile = getProfile(userId);
        userProfile.setBackgroundImageUrl(backgroundImageUrl);
        userProfileRepository.save(userProfile);
    }
}