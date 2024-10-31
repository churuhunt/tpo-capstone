package tpo.capstone.dto;

public class UserSummaryDTO {
    private String nickname;
    private String userId;
    private int points;

    public UserSummaryDTO(String nickname, String userId, int points) {
        this.nickname = nickname;
        this.userId = userId;
        this.points = points;
    }

    // Getters
    public String getNickname() {
        return nickname;
    }

    public String getUserId() {
        return userId;
    }

    public int getPoints() {
        return points;
    }
}