package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Block {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private UserAccount blocker;  // 차단하는 사람

    @ManyToOne
    private UserAccount blocked;  // 차단 당한 사람

    // 기본 생성자
    public Block() {
    }

    // 생성자
    public Block(UserAccount blocker, UserAccount blocked) {
        this.blocker = blocker;
        this.blocked = blocked;
    }
}