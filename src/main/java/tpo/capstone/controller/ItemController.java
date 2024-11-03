package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
    public ResponseEntity<List<Item>> getAllItems() {
        log.info("Fetching all items from the inventory.");
        List<Item> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }
}