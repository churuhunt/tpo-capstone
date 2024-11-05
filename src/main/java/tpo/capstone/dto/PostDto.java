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
    private String author; // UserAccount의 userId 또는 username을 저장
    private String category; // 게시물 카테고리 추가
    private LocalDateTime date; // LocalDateTime으로 변경
    private int likes;
    private int dislikes;
    private int views;

    // 엔티티에서 DTO로 변환
    public static PostDto fromEntity(Post post) {
        String authorId = post.getAuthor() != null ? post.getAuthor().getUserId() : "Unknown"; // author가 null이면 "Unknown"으로 설정
        return new PostDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                authorId,
                post.getCategory(),
                post.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(), // LocalDateTime으로 변환
                post.getLikes(),
                post.getDislikes(),
                post.getViews()
        );
    }

    // DTO에서 엔티티로 변환
    public Post toEntity(UserAccount authorAccount) {
        Post post = new Post();
        post.setId(this.id);
        post.setTitle(this.title);
        post.setContent(this.content);
        post.setAuthor(authorAccount);
        post.setCategory(this.category);
        post.setDate(Date.from(this.date.atZone(ZoneId.systemDefault()).toInstant())); // LocalDateTime을 Date로 변환
        post.setLikes(this.likes);
        post.setDislikes(this.dislikes);
        post.setViews(this.views);
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