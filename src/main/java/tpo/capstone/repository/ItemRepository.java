package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {

}