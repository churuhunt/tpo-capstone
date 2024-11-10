package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tpo.capstone.dto.ItemDto;
import tpo.capstone.entity.Item;
import tpo.capstone.service.ItemService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    /**
     * 모든 아이템 목록 조회 API
     * @return 모든 아이템의 리스트
     */
    @GetMapping
    public ResponseEntity<List<ItemDto>> getAllItems() {
        log.info("Fetching all items from the inventory.");
        List<ItemDto> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    // 카테고리별 아이템 조회 (오름차순)
    @GetMapping("/category/{category}/price-asc")
    public ResponseEntity<List<ItemDto>> getItemsByCategoryAscending(@PathVariable Item.Category category) {
        return ResponseEntity.ok(itemService.getItemsByCategoryAscending(category));
    }

    // 카테고리별 아이템 조회 (내림차순)
    @GetMapping("/category/{category}/price-desc")
    public ResponseEntity<List<ItemDto>> getItemsByCategoryDescending(@PathVariable Item.Category category) {
        return ResponseEntity.ok(itemService.getItemsByCategoryDescending(category));
    }
}