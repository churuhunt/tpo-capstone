package tpo.capstone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name; // 아이템 이름

    @Column(nullable = false)
    private int price; // 아이템 가격 (포인트로)

    @Column(length = 500)
    private String description; // 아이템 설명

    private String imageUrl; // 아이템 이미지 URL

    @Enumerated(EnumType.STRING)
    private Category category; // 아이템 카테고리

    // 기본 생성자
    public Item() {
    }

    // 모든 필드를 초기화하는 생성자
    public Item(String name, int price, String description, String imageUrl, Category category) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
    }

    // 이름과 가격만 받는 생성자
    public Item(String name, int price) {
        this.name = name;
        this.price = price;
    }

    // 아이템 카테고리 열거형
    public enum Category {
        PROFILE, BORDER, BACKGROUND, FONT, EMOJI, EFFECT, OTHER
    }
}
