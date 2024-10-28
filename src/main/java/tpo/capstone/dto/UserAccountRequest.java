package tpo.capstone.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;


@Getter
@Setter
public class UserAccountRequest {

    private String userId;

    @Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*]{8,16}$", message = "비밀번호는 8~16자의 영문 대소문자, 숫자, 특수문자로 이루어져야 합니다.")
    private String password;

    private String name;

    @Email(message = "이메일 형식이 아닙니다.")
    private String email;

    @Positive(message = "나이는 0보다 커야 합니다.")
    private int age;

    private String nickname;

    private String gender;
}