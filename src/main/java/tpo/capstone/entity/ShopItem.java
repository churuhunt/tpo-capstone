package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ShopItem extends Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String itemName; // Item의 name 필드와 혼동을 피하기 위해 다른 이름 사용

    @Column(nullable = false) // 필수값 설정
    private int price;

    @Column(length = 500) // 설명의 길이 제한 설정
    private String description;

    private String imageUrl;

    // 기본 생성자
    public ShopItem() {
        // 기본 생성자 필요 시 유지
    }

    // 모든 필드를 초기화하는 생성자
    public ShopItem(String itemName, int price, String description, String imageUrl) {
        this.itemName = itemName;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    // 선택적 필드를 위한 생성자
    public ShopItem(String itemName, int price) {
        this.itemName = itemName;
        this.price = price;
    }
}