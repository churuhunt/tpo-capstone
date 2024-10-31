package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "follower_id")
    private UserAccount follower;

    @ManyToOne
    @JoinColumn(name = "following_id")
    private UserAccount following;

    public Follow(UserAccount follower, UserAccount following) {
        this.follower = follower;
        this.following = following;
    }
}