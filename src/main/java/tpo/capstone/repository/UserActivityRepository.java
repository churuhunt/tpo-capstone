package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tpo.capstone.entity.UserActivity;

import java.util.List;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {
    @Query("SELECT ua FROM UserActivity ua WHERE ua.user.id IN :userIds ORDER BY ua.activityDate DESC")
    List<UserActivity> findTopPostsByUserIds(List<Long> userIds);
}