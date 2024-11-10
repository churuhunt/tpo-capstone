package tpo.capstone.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tpo.capstone.dto.ItemDto;
import tpo.capstone.entity.Item;
import tpo.capstone.repository.ItemRepository;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ItemService {

    private final ItemRepository itemRepository;
    private final S3Service s3Service;

    @Autowired
    public ItemService(ItemRepository itemRepository, S3Service s3Service) {
        this.itemRepository = itemRepository;
        this.s3Service = s3Service;
    }

    /**
     * 모든 아이템 목록을 가져옵니다.
     *
     * @return 모든 Item 객체의 리스트
     */
    public List<ItemDto> getAllItems() {
        List<Item> items = itemRepository.findAll();
        return items.stream()
                .map(ItemDto::fromEntity)
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

    public ItemDto createItem(String name, String description, int price, Item.Category category, MultipartFile imageFile) throws IOException {
        // name 필드 유효성 검사
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Item name cannot be empty");
        }

        // price 필드 유효성 검사
        if (price <= 0) {
            throw new IllegalArgumentException("Item price must be greater than 0");
        }

        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = s3Service.uploadImage(imageFile);
        }

        Item item = new Item(name, price, description, imageUrl, category);
        itemRepository.save(item);

        return ItemDto.fromEntity(item);
    }

}
