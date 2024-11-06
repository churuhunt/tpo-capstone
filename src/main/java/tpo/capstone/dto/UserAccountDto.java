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
    private Long id;  // ID 필드 추가
    private String userId;
    private String password;
    private String name;
    private int age;
    private String gender;
    private String email;
    private String nickname;
    private int points;

    // 엔티티에서 DTO로 변환
    public static UserAccountDto fromEntity(UserAccount userAccount) {
        return new UserAccountDto(
                userAccount.getId(),  // ID 설정
                userAccount.getUserId(),
                userAccount.getPassword(),
                userAccount.getName(),
                userAccount.getAge(),
                userAccount.getGender(),
                userAccount.getEmail(),
                userAccount.getNickname(),
                userAccount.getPoints()
        );
    }

    // DTO에서 엔티티로 변환
    public UserAccount toEntity() {
        return UserAccount.builder()
                .id(this.id)  // ID 설정
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