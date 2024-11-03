package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.UserActivityData;

public interface UserActivityDataRepository extends JpaRepository<UserActivityData, Long> {

}
