package tpo.capstone.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.PurchaseHistory;
import tpo.capstone.entity.ShopItem;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.PurchaseHistoryRepository;
import tpo.capstone.repository.ShopItemRepository;
import tpo.capstone.repository.UserAccountRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShopService {

    @Autowired
    private ShopItemRepository shopItemRepository;

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Transactional
    public PurchaseHistory purchaseItem(Long userId, Long itemId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        ShopItem item = shopItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid item ID"));

        // 포인트가 충분한지 확인
        if (user.getPoints() < item.getPrice()) {
            throw new IllegalArgumentException("Insufficient points for purchase");
        }

        // 포인트 차감
        user.setPoints(user.getPoints() - item.getPrice());
        userAccountRepository.save(user);

        // 구매 기록 저장
        PurchaseHistory purchase = new PurchaseHistory();
        purchase.setUser(user);
        purchase.setItem(item);
        purchase.setPurchaseDate(LocalDateTime.now());
        return purchaseHistoryRepository.save(purchase);
    }

    public List<ShopItem> getAllItems() {
        return shopItemRepository.findAll();
    }

    // 가격순 정렬 (오름차순)
    public List<ShopItem> getItemsByAscendingPrice() {
        return shopItemRepository.findAllByOrderByPriceAsc();
    }

    // 가격순 정렬 (내림차순)
    public List<ShopItem> getItemsByDescendingPrice() {
        return shopItemRepository.findAllByOrderByPriceDesc();
    }

    // 특정 사용자의 구매 내역 조회
    public List<PurchaseHistory> getPurchaseHistory(Long userId) {
        return purchaseHistoryRepository.findByUserIdOrderByPurchaseDateDesc(userId);
    }
}
