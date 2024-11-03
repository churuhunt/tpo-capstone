package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserAccount user;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    // 기본 생성자, getter 및 setter
    public Bookmark() {
    }

    public Bookmark(UserAccount user, Post post) {
        this.user = user;
        this.post = post;
    }
}