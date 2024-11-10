package tpo.capstone.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tpo.capstone.dto.ItemDto;
import tpo.capstone.entity.Item;
import tpo.capstone.service.ItemService;

import java.io.IOException;
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
     *
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

    @PostMapping("/create")
    public ResponseEntity<ItemDto> createItem(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") int price,
            @RequestParam("category") Item.Category category,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        try {
            // 아이템 생성 로직 추가
            ItemDto newItem = itemService.createItem(name, description, price, category, imageFile);
            return ResponseEntity.ok(newItem);
        } catch (IOException e) {
            // 예외 처리 - 파일 업로드 실패 시 적절한 오류 메시지 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}