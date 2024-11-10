package tpo.capstone.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.Item;
import tpo.capstone.entity.PurchaseHistory;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.ItemRepository;
import tpo.capstone.repository.PurchaseHistoryRepository;
import tpo.capstone.repository.UserAccountRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShopService {

    private final ItemRepository itemRepository;
    private final PurchaseHistoryRepository purchaseHistoryRepository;
    private final UserAccountRepository userAccountRepository;

    @Autowired
    public ShopService(ItemRepository itemRepository,
                       PurchaseHistoryRepository purchaseHistoryRepository,
                       UserAccountRepository userAccountRepository) {
        this.itemRepository = itemRepository;
        this.purchaseHistoryRepository = purchaseHistoryRepository;
        this.userAccountRepository = userAccountRepository;
    }

    /**
     * 아이템 구매 처리
     * @param userId 사용자 ID
     * @param itemId 구매할 아이템 ID
     * @return PurchaseHistory 구매 내역 객체
     */
    @Transactional
    public PurchaseHistory purchaseItem(Long userId, Long itemId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid item ID"));

        // 포인트가 충분한지 확인
        if (user.getPoints() < item.getPrice()) {
            throw new IllegalArgumentException("Insufficient points for purchase");
        }

        // 포인트 차감 및 사용자 정보 저장
        user.setPoints(user.getPoints() - item.getPrice());
        userAccountRepository.save(user);

        // 구매 기록 저장
        PurchaseHistory purchase = new PurchaseHistory(user, item, LocalDateTime.now());
        return purchaseHistoryRepository.save(purchase);
    }


    /**
     * 모든 상점 아이템 목록 반환
     * @return List<ShopItem> 아이템 목록
     */
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    /**
     * 가격 오름차순 정렬된 아이템 목록 반환
     * @return List<ShopItem> 오름차순으로 정렬된 아이템 목록
     */
    public List<Item> getItemsByAscendingPrice() {
        return itemRepository.findAllByOrderByPriceAsc();
    }

    /**
     * 가격 내림차순 정렬된 아이템 목록 반환
     * @return List<ShopItem> 내림차순으로 정렬된 아이템 목록
     */
    public List<Item> getItemsByDescendingPrice() {
        return itemRepository.findAllByOrderByPriceDesc();
    }

    /**
     * 특정 사용자의 구매 내역 반환
     * @param userId 사용자 ID
     * @return List<PurchaseHistory> 구매 내역 목록
     */
    public List<PurchaseHistory> getPurchaseHistory(Long userId) {
        return purchaseHistoryRepository.findByUser_IdOrderByPurchaseDateDesc(userId);
    }
}
