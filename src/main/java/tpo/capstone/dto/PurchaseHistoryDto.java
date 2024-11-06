package tpo.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tpo.capstone.entity.PurchaseHistory;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseHistoryDto {
    private Long id;
    private ItemDto item;
    private LocalDateTime purchaseDate; // LocalDateTime으로 변경

    public static PurchaseHistoryDto fromEntity(PurchaseHistory purchaseHistory) {
        return new PurchaseHistoryDto(
                purchaseHistory.getId(),
                ItemDto.fromEntity(purchaseHistory.getItem()),
                purchaseHistory.getPurchaseDate()
        );
    }
}