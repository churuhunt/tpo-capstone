package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.entity.PurchaseHistory;
import tpo.capstone.entity.ShopItem;
import tpo.capstone.service.ShopService;

import java.util.List;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping("/items")
    public ResponseEntity<List<ShopItem>> getAllItems() {
        return ResponseEntity.ok(shopService.getAllItems());
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> purchaseItem(@RequestParam Long userId, @RequestParam Long itemId) {
        try {
            PurchaseHistory purchase = shopService.purchaseItem(userId, itemId);
            return ResponseEntity.ok("Purchase successful: " + purchase.getItem().getItemName());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 가격순 정렬된 물품 조회 (오름차순)
    @GetMapping("/items/price-asc")
    public ResponseEntity<List<ShopItem>> getItemsByAscendingPrice() {
        return ResponseEntity.ok(shopService.getItemsByAscendingPrice());
    }

    // 가격순 정렬된 물품 조회 (내림차순)
    @GetMapping("/items/price-desc")
    public ResponseEntity<List<ShopItem>> getItemsByDescendingPrice() {
        return ResponseEntity.ok(shopService.getItemsByDescendingPrice());
    }

    // 특정 사용자의 구매 내역 조회
    @GetMapping("/purchase-history/{userId}")
    public ResponseEntity<List<PurchaseHistory>> getPurchaseHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(shopService.getPurchaseHistory(userId));
    }
}
