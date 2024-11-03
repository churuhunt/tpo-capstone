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
public class ReportRequest {

    /**
     * 신고 사유
     */
    @NotBlank(message = "신고 사유는 반드시 입력해야 합니다.")
    private String reason;
}