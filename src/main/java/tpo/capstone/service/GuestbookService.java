package tpo.capstone.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.dto.GuestbookCommentResponseDto;
import tpo.capstone.entity.GuestbookComment;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.GuestbookRepository;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GuestbookService {

    private final GuestbookRepository guestbookRepository;
    private final UserAccountService userAccountService;

    @Autowired
    public GuestbookService(GuestbookRepository guestbookRepository, UserAccountService userAccountService) {
        this.guestbookRepository = guestbookRepository;
        this.userAccountService = userAccountService;
    }

    public List<GuestbookCommentResponseDto> getGuestbookComments() {
        return guestbookRepository.findAll().stream()
                .map(GuestbookCommentResponseDto::fromEntity) // 변경: 통합된 DTO 사용
                .collect(Collectors.toList());
    }

    @Transactional
    public GuestbookCommentResponseDto addGuestbookComment(GuestbookCommentResponseDto commentResponse, String userId) {
        UserAccount userAccount = userAccountService.findByUserId(userId);
        if (userAccount == null) {
            throw new IllegalArgumentException("Invalid user ID");
        }

        GuestbookComment newComment = new GuestbookComment();
        newComment.setContent(commentResponse.getContent());
        newComment.setDate(new Date());
        newComment.setName(userAccount.getNickname());
        newComment.setProfileImageUrl(userAccount.getUserProfile().getProfileImageUrl());
        guestbookRepository.save(newComment);

        // 엔티티에서 DTO로 변환하여 반환
        return GuestbookCommentResponseDto.fromEntity(newComment);
    }
}