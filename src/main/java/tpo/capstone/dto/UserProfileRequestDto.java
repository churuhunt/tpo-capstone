package tpo.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserProfileRequestDto {
    private Long userId;
    private String profileImageUrl;
    private String backgroundImageUrl;
    private String nicknameDecoration;
    private String introduction;
    private String interests;
}
