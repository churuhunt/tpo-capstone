package tpo.capstone.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.Item;
import tpo.capstone.repository.ItemRepository;

import java.util.List;

@Service
@Slf4j
public class ItemService {

    private final ItemRepository itemRepository;

    @Autowired
    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    /**
     * 모든 아이템 목록을 가져옵니다.
     *
     * @return 모든 Item 객체의 리스트
     */
    public List<Item> getAllItems() {
        List<Item> items = itemRepository.findAll();
        if (items.isEmpty()) {
            log.info("조회된 아이템 목록이 없습니다.");
        } else {
            log.info("아이템 목록 조회 완료: 총 {}개 항목", items.size());
        }
        return items;
    }
}
