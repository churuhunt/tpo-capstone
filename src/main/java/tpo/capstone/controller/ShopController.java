package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.entity.PurchaseHistory;
import tpo.capstone.entity.ShopItem;
import tpo.capstone.service.ShopService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/shop")
public class ShopController {

    private final ShopService shopService;

    @Autowired
    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    /**
     * 모든 아이템 목록 조회
     */
    @GetMapping("/items")
    public ResponseEntity<List<ShopItem>> getAllItems() {
        return ResponseEntity.ok(shopService.getAllItems());
    }

    /**
     * 아이템 구매 처리
     * @param userId 사용자 ID
     * @param itemId 아이템 ID
     * @return 구매 결과
     */
    @PostMapping("/purchase")
    public ResponseEntity<String> purchaseItem(@RequestParam Long userId, @RequestParam Long itemId) {
        try {
            PurchaseHistory purchase = shopService.purchaseItem(userId, itemId);
            return ResponseEntity.ok("Purchase successful: " + purchase.getItem().getItemName());
        } catch (IllegalArgumentException e) {
            log.error("Error during purchase: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during purchase", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    /**
     * 가격순 오름차순으로 정렬된 아이템 목록 조회
     */
    @GetMapping("/items/price-asc")
    public ResponseEntity<List<ShopItem>> getItemsByAscendingPrice() {
        return ResponseEntity.ok(shopService.getItemsByAscendingPrice());
    }

    /**
     * 가격순 내림차순으로 정렬된 아이템 목록 조회
     */
    @GetMapping("/items/price-desc")
    public ResponseEntity<List<ShopItem>> getItemsByDescendingPrice() {
        return ResponseEntity.ok(shopService.getItemsByDescendingPrice());
    }

    /**
     * 특정 사용자의 구매 내역 조회
     * @param userId 사용자 ID
     * @return 구매 내역 리스트
     */
    @GetMapping("/purchase-history/{userId}")
    public ResponseEntity<List<PurchaseHistory>> getPurchaseHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(shopService.getPurchaseHistory(userId));
    }
}
