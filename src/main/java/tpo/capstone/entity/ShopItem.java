package tpo.capstone.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ShopItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private int price;
    private String description;
    private String imageUrl;


    public ShopItem() {

    }

    public ShopItem(String itemName, int price, String description, String imageUrl) {
        this.itemName = itemName;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }
}