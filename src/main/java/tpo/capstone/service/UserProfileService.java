package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.UserProfile;
import tpo.capstone.repository.UserProfileRepository;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    public UserProfile getProfile(Long userId) {
        return userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found"));
    }

    public UserProfile updateProfile(Long userId, UserProfile updatedProfile) {
        UserProfile userProfile = getProfile(userId);
        userProfile.setProfileImageUrl(updatedProfile.getProfileImageUrl());
        userProfile.setBackgroundImageUrl(updatedProfile.getBackgroundImageUrl());
        userProfile.setNicknameDecoration(updatedProfile.getNicknameDecoration());
        userProfile.setIntroduction(updatedProfile.getIntroduction());
        userProfile.setInterests(updatedProfile.getInterests());
        return userProfileRepository.save(userProfile);
    }
}
