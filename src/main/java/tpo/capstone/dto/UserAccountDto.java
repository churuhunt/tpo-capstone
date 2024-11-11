package tpo.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.UserProfile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAccountDto {
    private Long id;
    private String userId;
    private String password;
    private String name;
    private int age;
    private String gender;
    private String email;
    private String nickname;
    private int points;
    private String profileImageUrl;
    private String backgroundImageUrl;
    private String nicknameDecoration;
    private String introduction;
    private String interests;

    // 엔티티에서 DTO로 변환
    public static UserAccountDto fromEntity(UserAccount userAccount) {
        UserProfile profile = userAccount.getUserProfile();
        return new UserAccountDto(
                userAccount.getId(),
                userAccount.getUserId(),
                userAccount.getPassword(),
                userAccount.getName(),
                userAccount.getAge(),
                userAccount.getGender(),
                userAccount.getEmail(),
                userAccount.getNickname(),
                userAccount.getPoints(),
                profile != null ? profile.getProfileImageUrl() : null,
                profile != null ? profile.getBackgroundImageUrl() : null,
                profile != null ? profile.getNicknameDecoration() : null,
                profile != null ? profile.getIntroduction() : null,
                profile != null ? profile.getInterests() : null
        );
    }

    // DTO에서 엔티티로 변환
    public UserAccount toEntity() {
        UserAccount userAccount = UserAccount.builder()
                .userId(this.userId)
                .password(this.password)
                .name(this.name)
                .age(this.age)
                .gender(this.gender)
                .email(this.email)
                .nickname(this.nickname)
                .points(this.points)
                .build();

        // 프로필 데이터를 UserProfile로 변환하여 UserAccount와 연관 설정
        if (this.profileImageUrl != null || this.backgroundImageUrl != null ||
                this.nicknameDecoration != null || this.introduction != null || this.interests != null) {
            UserProfile profile = new UserProfile();
            profile.setProfileImageUrl(this.profileImageUrl);
            profile.setBackgroundImageUrl(this.backgroundImageUrl);
            profile.setNicknameDecoration(this.nicknameDecoration);
            profile.setIntroduction(this.introduction);
            profile.setInterests(this.interests);
            profile.setUser(userAccount);
            userAccount.setUserProfile(profile);
        }

        return userAccount;
    }
}