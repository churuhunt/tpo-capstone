package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tpo.capstone.entity.Follow;
import tpo.capstone.entity.UserAccount;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    Optional<Follow> findByFollowerAndFollowing(UserAccount follower, UserAccount following);

    List<Follow> findByFollower_Id(Long followerId);  // follower의 id를 사용하여 조회

    List<Follow> findByFollowing(UserAccount following);  // following 사용자를 기준으로 팔로우 목록 조회

    boolean existsByFollowerAndFollowing(UserAccount follower, UserAccount following);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.following = :following")
    int countByFollowing(@Param("following") UserAccount following);
}