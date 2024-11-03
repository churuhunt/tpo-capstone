package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.PurchaseHistory;

import java.util.List;

public interface PurchaseHistoryRepository extends JpaRepository<PurchaseHistory, Long> {

    // 특정 사용자 구매 내역 조회
    List<PurchaseHistory> findByUserIdOrderByPurchaseDateDesc(Long userId);

}