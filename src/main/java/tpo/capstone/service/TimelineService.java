package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.UserActivity;
import tpo.capstone.repository.UserActivityRepository;

import java.util.List;

@Service
public class TimelineService {

    @Autowired
    private UserActivityRepository userActivityRepository;

    public List<UserActivity> getUserTimeline(Long userId) {
        return userActivityRepository.findByUserIdOrderByActivityDateDesc(userId);
    }
}