package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.ShopItem;

import java.util.List;

public interface ShopItemRepository extends JpaRepository<ShopItem, Long> {

    // 가격순으로 정렬된 물품 조회
    List<ShopItem> findAllByOrderByPriceAsc();

    List<ShopItem> findAllByOrderByPriceDesc();

}
