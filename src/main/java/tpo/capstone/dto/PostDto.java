package tpo.capstone.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserAccount;

import java.time.OffsetDateTime;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private Long id;
    private String title;
    private String content;
    private String author;
    private String profileImageUrl; // 프로필 이미지 URL 추가
    private String category;
    private String smallCategory;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private OffsetDateTime date;
    private int likes;
    private int dislikes;
    private int views;
    private String imageUrl;

    // 엔티티에서 DTO로 변환하는 메서드
    public static PostDto fromEntity(Post post) {
        String authorNickname = post.getAuthor() != null ? post.getAuthor().getNickname() : "Unknown";
        String profileImageUrl = (post.getAuthor() != null && post.getAuthor().getUserProfile() != null)
                ? post.getAuthor().getUserProfile().getProfileImageUrl()
                : null; // 프로필 이미지 URL이 없을 경우 null로 설정

        return new PostDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                authorNickname,
                profileImageUrl,  // 프로필 이미지 URL 설정 (없을 경우 null)
                post.getCategory(),
                post.getSmallCategory(),
                post.getDate(),
                post.getLikes(),
                post.getDislikes(),
                post.getViews(),
                post.getImageUrl()
        );
    }

    // DTO에서 엔티티로 변환하는 메서드
    public Post toEntity(UserAccount authorAccount) {
        Post post = new Post();
        post.setId(this.id);
        post.setTitle(this.title);
        post.setContent(this.content);
        post.setAuthor(authorAccount);
        post.setAuthorNickname(authorAccount.getNickname());
        post.setCategory(this.category);
        post.setSmallCategory(this.smallCategory);
        post.setDate(this.date);
        post.setLikes(this.likes);
        post.setDislikes(this.dislikes);
        post.setViews(this.views);
        post.setImageUrl(this.imageUrl);
        return post;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PostDto)) return false;
        PostDto postDto = (PostDto) o;
        return likes == postDto.likes &&
                dislikes == postDto.dislikes &&
                views == postDto.views &&
                Objects.equals(id, postDto.id) &&
                Objects.equals(title, postDto.title) &&
                Objects.equals(content, postDto.content) &&
                Objects.equals(author, postDto.author) &&
                Objects.equals(category, postDto.category) && // 카테고리 추가
                Objects.equals(smallCategory, postDto.smallCategory) && // 소카테고리 추가
                Objects.equals(date, postDto.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, content, author, category, smallCategory, date, likes, dislikes, views);
    }
}