package tpo.capstone.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserAccount;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Date;
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
    private String category;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private OffsetDateTime date;
    private int likes;
    private int dislikes;
    private int views;
    private String imageUrl;

    // 엔티티에서 DTO로 변환하는 메서드
    public static PostDto fromEntity(Post post) {
        String authorNickname = post.getAuthor() != null ? post.getAuthor().getNickname() : "Unknown";
        return new PostDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                authorNickname, // nickname으로 설정
                post.getCategory(),
                post.getDate(),
                post.getLikes(),
                post.getDislikes(),
                post.getViews(),
                post.getImageUrl()
        );
    }

    public Post toEntity(UserAccount authorAccount) {
        Post post = new Post();
        post.setId(this.id);
        post.setTitle(this.title);
        post.setContent(this.content);
        post.setAuthor(authorAccount);
        post.setCategory(this.category);
        post.setDate(this.date); // `OffsetDateTime`을 그대로 사용
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
                Objects.equals(date, postDto.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, content, author, date, likes, dislikes, views);
    }
}