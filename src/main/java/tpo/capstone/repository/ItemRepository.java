package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
    // 필요한 쿼리 메서드를 추가
}