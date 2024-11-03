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
    @JoinColumn(name = "user_id")
    private UserAccount user;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private ShopItem item;

    private LocalDateTime purchaseDate;

    public PurchaseHistory() {

    }

    public PurchaseHistory(UserAccount user, ShopItem item, LocalDateTime purchaseDate) {
        this.user = user;
        this.item = item;
        this.purchaseDate = purchaseDate;
    }
}