package tpo.capstone.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tpo.capstone.entity.Item;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemDto {

    private Long id;

    @NotEmpty(message = "Item name cannot be empty")
    private String name;

    private String description;

    @NotNull(message = "Item price cannot be null")
    private int price;

    private Item.Category category;
    private String imageUrl;

    public static ItemDto fromEntity(Item item) {
        return new ItemDto(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getPrice(),
                item.getCategory(),
                item.getImageUrl()
        );
    }
}