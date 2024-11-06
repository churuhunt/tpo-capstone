package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.ShopItem;

import java.util.List;

public interface ShopItemRepository extends JpaRepository<ShopItem, Long> {

    // 가격순으로 정렬된 물품 조회
    List<ShopItem> findAllByOrderByPriceAsc();

    List<ShopItem> findAllByOrderByPriceDesc();

    // 특정 가격 이상인 물품을 가격 오름차순으로 정렬
    List<ShopItem> findByPriceGreaterThanEqualOrderByPriceAsc(int minPrice);

    // 특정 가격 이하인 물품을 가격 내림차순으로 정렬
    List<ShopItem> findByPriceLessThanEqualOrderByPriceDesc(int maxPrice);
}
