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

    @Column(nullable = false)
    private String name; // 아이템 이름 (필수값으로 지정)

    @Column(nullable = false)
    private int price; // 아이템 가격 (포인트로)

    @Column(length = 255)
    private String description; // 아이템 설명 (선택 사항)

    private String imageUrl; // 아이템 이미지 URL (선택 사항)

    private int stock;

    @Enumerated(EnumType.STRING)
    private Category category;

    // 기본 생성자
    public Item() {
    }

    // 모든 필드를 초기화하는 생성자
    public Item(String name, int price, String description, String imageUrl, int stock, Category category) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.stock = stock;
        this.category = category;
    }

    public enum Category {
        PROFILE, BORDER, BACKGROUND, FONT, EMOJI, EFFECT, OTHER
    }

}
