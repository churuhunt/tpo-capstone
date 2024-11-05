package tpo.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tpo.capstone.entity.Post;
import tpo.capstone.entity.UserAccount;

import java.time.LocalDateTime;
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
    private LocalDateTime date;
    private int likes;
    private int dislikes;
    private int views;
    private String imageUrl; // 새로 추가된 이미지 URL 필드


    // 엔티티에서 DTO로 변환하는 메서드
    public static PostDto fromEntity(Post post) {
        String authorId = post.getAuthor() != null ? post.getAuthor().getUserId() : "Unknown";
        return new PostDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                authorId,
                post.getCategory(),
                post.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(),
                post.getLikes(),
                post.getDislikes(),
                post.getViews(),
                post.getImageUrl() // 이미지 URL 추가
        );
    }

    // DTO에서 엔티티로 변환하는 메서드
    public Post toEntity(UserAccount authorAccount) {
        Post post = new Post();
        post.setId(this.id);
        post.setTitle(this.title);
        post.setContent(this.content);
        post.setAuthor(authorAccount);
        post.setCategory(this.category);
        post.setDate(Date.from(this.date.atZone(ZoneId.systemDefault()).toInstant()));
        post.setLikes(this.likes);
        post.setDislikes(this.dislikes);
        post.setViews(this.views);
        post.setImageUrl(this.imageUrl); // 이미지 URL 설정
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