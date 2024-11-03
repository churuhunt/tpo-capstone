package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class PurchaseHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // user_id 필드는 반드시 필요합니다.
    private UserAccount user;  // 구매한 사용자

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false) // item_id 필드는 반드시 필요합니다.
    private ShopItem item;  // 구매한 아이템

    @Column(nullable = false)
    private LocalDateTime purchaseDate;  // 구매 날짜

    // 기본 생성자
    public PurchaseHistory() {
    }

    // 매개변수 있는 생성자
    public PurchaseHistory(UserAccount user, ShopItem item, LocalDateTime purchaseDate) {
        this.user = user;
        this.item = item;
        this.purchaseDate = purchaseDate;
    }
}