package tpo.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tpo.capstone.entity.UserAccount;

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
    private String profileImageUrl; // 프로필 이미지 URL 필드 추가

    // 엔티티에서 DTO로 변환
    public static UserAccountDto fromEntity(UserAccount userAccount) {
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
                userAccount.getUserProfile() != null ? userAccount.getUserProfile().getProfileImageUrl() : null // 프로필 이미지 URL 추가
        );
    }

    // DTO에서 엔티티로 변환
    public UserAccount toEntity() {
        return UserAccount.builder()
                .id(this.id)
                .userId(this.userId)
                .password(this.password)
                .name(this.name)
                .age(this.age)
                .gender(this.gender)
                .email(this.email)
                .nickname(this.nickname)
                .points(this.points)
                .build();
    }
}