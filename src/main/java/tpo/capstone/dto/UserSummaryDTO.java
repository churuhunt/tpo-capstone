package tpo.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserSummaryDTO {
    private final String nickname;
    private final String userId;
    private final int points;
}