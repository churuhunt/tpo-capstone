package tpo.capstone.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.dto.ItemDto;
import tpo.capstone.entity.Item;
import tpo.capstone.repository.ItemRepository;

import java.util.List;
import java.util.stream.Collectors;

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
    public List<ItemDto> getAllItems() {
        List<Item> items = itemRepository.findAll();
        return items.stream()
                .map(item -> new ItemDto(item.getId(), item.getName(), item.getDescription(), item.getPrice(), item.getStock()))
                .collect(Collectors.toList());
    }

    // 카테고리별 아이템 목록 조회 (오름차순)
    public List<ItemDto> getItemsByCategoryAscending(Item.Category category) {
        List<Item> items = itemRepository.findByCategoryOrderByPriceAsc(category);
        return items.stream()
                .map(ItemDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 카테고리별 아이템 목록 조회 (내림차순)
    public List<ItemDto> getItemsByCategoryDescending(Item.Category category) {
        List<Item> items = itemRepository.findByCategoryOrderByPriceDesc(category);
        return items.stream()
                .map(ItemDto::fromEntity)
                .collect(Collectors.toList());
    }

}
