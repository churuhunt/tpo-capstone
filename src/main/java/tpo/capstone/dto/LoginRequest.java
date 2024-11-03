package tpo.capstone.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    /**
     * 사용자 ID (로그인 시 사용)
     */
    @NotBlank(message = "사용자 ID는 필수 입력 항목입니다.")
    private String userId;

    /**
     * 비밀번호 (로그인 시 사용)
     */
    @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
    private String password;
}