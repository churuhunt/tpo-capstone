package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.Item;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findAllByOrderByPriceAsc();
    List<Item> findAllByOrderByPriceDesc();
    List<Item> findByCategoryOrderByPriceAsc(Item.Category category);
    List<Item> findByCategoryOrderByPriceDesc(Item.Category category);
}