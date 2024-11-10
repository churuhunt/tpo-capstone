package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tpo.capstone.dto.UserProfileRequestDto;
import tpo.capstone.entity.UserProfile;
import tpo.capstone.service.S3Service;
import tpo.capstone.service.UserProfileService;

import java.io.IOException;

@RestController
@RequestMapping("/api/user-profiles")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final S3Service s3Service;

    @Autowired
    public UserProfileController(UserProfileService userProfileService, S3Service s3Service) {
        this.userProfileService = userProfileService;
        this.s3Service = s3Service;
    }

    // 프로필 정보 조회
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileRequestDto> getUserProfile(@PathVariable Long userId) {
        UserProfile userProfile = userProfileService.getProfile(userId);
        UserProfileRequestDto userProfileDto = new UserProfileRequestDto(
                userId,
                userProfile.getProfileImageUrl(),
                userProfile.getBackgroundImageUrl(),
                userProfile.getNicknameDecoration(),
                userProfile.getIntroduction(),
                userProfile.getInterests()
        );
        return ResponseEntity.ok(userProfileDto);
    }

    // 프로필 정보 업데이트
    @PutMapping("/{userId}")
    public ResponseEntity<String> updateUserProfile(
            @PathVariable Long userId,
            @RequestBody UserProfileRequestDto userProfileRequestDto) {

        userProfileService.updateProfileData(userId, userProfileRequestDto);
        return ResponseEntity.ok("프로필 정보가 업데이트되었습니다.");
    }

    // 프로필 이미지 업로드 및 URL 저장
    @PostMapping("/{userId}/upload-profile-image")
    public ResponseEntity<String> uploadProfileImage(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = s3Service.uploadImage(file); // S3에 파일 업로드
            userProfileService.updateProfileImage(userId, imageUrl); // 프로필에 이미지 URL 저장
            return ResponseEntity.ok(imageUrl); // 저장된 URL 반환
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("프로필 이미지 업로드 실패");
        }
    }

    // 배경 이미지 업로드 및 URL 저장
    @PostMapping("/{userId}/upload-background-image")
    public ResponseEntity<String> uploadBackgroundImage(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = s3Service.uploadImage(file); // S3에 파일 업로드
            userProfileService.updateBackgroundImage(userId, imageUrl); // 배경 이미지 URL 저장
            return ResponseEntity.ok(imageUrl); // 저장된 URL 반환
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("배경 이미지 업로드 실패");
        }
    }
}