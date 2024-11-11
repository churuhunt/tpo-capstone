package tpo.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tpo.capstone.entity.UserProfile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String profileImageUrl;
    private String backgroundImageUrl;
    private String nicknameDecoration;
    private String introduction;
    private String interests;

    // 엔티티에서 DTO로 변환하는 메서드
    public static UserProfileDto fromEntity(UserProfile userProfile) {
        return new UserProfileDto(
                userProfile.getId(),
                userProfile.getProfileImageUrl(),
                userProfile.getBackgroundImageUrl(),
                userProfile.getNicknameDecoration(),
                userProfile.getIntroduction(),
                userProfile.getInterests()
        );
    }
}
