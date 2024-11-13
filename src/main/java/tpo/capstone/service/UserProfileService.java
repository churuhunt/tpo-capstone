package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tpo.capstone.dto.UserProfileRequestDto;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.UserProfile;
import tpo.capstone.repository.UserAccountRepository;
import tpo.capstone.repository.UserProfileRepository;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    /**
     * 특정 사용자의 프로필 조회
     *
     * @param userId 사용자 ID
     * @return 사용자 프로필 정보
     * @throws IllegalArgumentException 사용자 계정을 찾을 수 없거나 프로필이 설정되지 않았을 때 발생
     */
    @Transactional
    public UserProfile getProfile(Long userId) {
        UserAccount userAccount = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User account not found for ID: " + userId));
        return userAccount.getUserProfile();
    }

    @Transactional
    public void updateIntroduction(Long userId, String introduction) {
        UserProfile userProfile = userProfileRepository.findByUser_Id(userId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found"));

        userProfile.setIntroduction(introduction);
        userProfileRepository.save(userProfile);
    }

    /**
     * 특정 사용자의 프로필 업데이트
     *
     * @param userId     사용자 ID
     * @param profileDto 업데이트할 프로필 정보
     * @throws IllegalArgumentException 사용자 계정이나 프로필을 찾을 수 없을 때 발생
     */
    @Transactional
    public UserProfile updateProfileData(Long userId, UserProfileRequestDto profileDto) {
        UserAccount userAccount = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User account not found for ID: " + userId));
        UserProfile userProfile = userAccount.getUserProfile();
        if (userProfile == null) {
            throw new IllegalArgumentException("User profile not found for user ID: " + userId);
        }

        userProfile.setProfileImageUrl(profileDto.getProfileImageUrl());
        userProfile.setBackgroundImageUrl(profileDto.getBackgroundImageUrl());
        userProfile.setNicknameDecoration(profileDto.getNicknameDecoration());
        userProfile.setIntroduction(profileDto.getIntroduction());
        userProfile.setInterests(profileDto.getInterests());

        return userProfileRepository.save(userProfile);
    }

    /**
     * 프로필 이미지 URL 업데이트
     *
     * @param userId          사용자 ID
     * @param profileImageUrl 새로운 프로필 이미지 URL
     * @throws IllegalArgumentException 사용자 계정이나 프로필을 찾을 수 없을 때 발생
     */
    @Transactional
    public void updateProfileImage(Long userId, String profileImageUrl) {
        UserAccount userAccount = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User account not found for ID: " + userId));
        UserProfile userProfile = userAccount.getUserProfile();
        if (userProfile == null) {
            throw new IllegalArgumentException("User profile not found for user ID: " + userId);
        }
        userProfile.setProfileImageUrl(profileImageUrl);
        userProfileRepository.save(userProfile);
    }

    /**
     * 배경 이미지 URL 업데이트
     *
     * @param userId             사용자 ID
     * @param backgroundImageUrl 새로운 배경 이미지 URL
     * @throws IllegalArgumentException 사용자 계정이나 프로필을 찾을 수 없을 때 발생
     */
    @Transactional
    public void updateBackgroundImage(Long userId, String backgroundImageUrl) {
        UserAccount userAccount = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User account not found for ID: " + userId));
        UserProfile userProfile = userAccount.getUserProfile();
        if (userProfile == null) {
            throw new IllegalArgumentException("User profile not found for user ID: " + userId);
        }
        userProfile.setBackgroundImageUrl(backgroundImageUrl);
        userProfileRepository.save(userProfile);
    }

    private UserProfile getCurrentUserProfile() {
        // 현재 인증된 사용자의 ID를 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName(); // userId가 SecurityContext에 저장된 사용자 ID라고 가정

        // userId를 이용해 UserAccount 조회
        UserAccount userAccount = userAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with userId: " + userId));

        // UserAccount의 ID를 통해 UserProfile 조회
        return userProfileRepository.findByUser_Id(userAccount.getId())
                .orElseThrow(() -> new IllegalArgumentException("User profile not found for userId: " + userId));
    }

    public void updateProfileImageUrl(String imageUrl) {
        UserProfile userProfile = getCurrentUserProfile();
        userProfile.setProfileImageUrl(imageUrl);
        userProfileRepository.save(userProfile);
    }

    public void updateBackgroundImageUrl(String imageUrl) {
        UserProfile userProfile = getCurrentUserProfile();
        userProfile.setBackgroundImageUrl(imageUrl);
        userProfileRepository.save(userProfile);
    }

}