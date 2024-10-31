package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import tpo.capstone.entity.Block;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.entity.UserSettings;
import tpo.capstone.repository.BlockRepository;
import tpo.capstone.repository.UserAccountRepository;
import tpo.capstone.repository.UserSettingsRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserSettingsService {

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private BlockRepository blockRepository;


    // 닉네임 변경 - 7일 제한 적용
    public boolean changeNickname(Long userId, String newNickname) {
        UserSettings settings = getUserSettings(userId);
        if (settings.getNicknameLastChanged().isAfter(LocalDateTime.now().minusDays(7))) {
            throw new IllegalArgumentException("닉네임은 7일에 한 번만 변경할 수 있습니다.");
        }
        UserAccount user = settings.getUser();
        user.setNickname(newNickname);
        settings.setNicknameLastChanged(LocalDateTime.now());
        userAccountRepository.save(user);
        userSettingsRepository.save(settings);
        return true;
    }

    // 이메일 변경 - 1회 한정
    public boolean changeEmail(Long userId, String newEmail) {
        UserSettings settings = getUserSettings(userId);
        if (settings.isEmailChanged()) {
            throw new IllegalArgumentException("이메일은 한 번만 변경할 수 있습니다.");
        }
        UserAccount user = settings.getUser();
        user.setEmail(newEmail);
        settings.setEmailChanged(true);
        userAccountRepository.save(user);
        userSettingsRepository.save(settings);
        return true;
    }

    // 아이디 변경
    public boolean changeUserId(Long userId, String newUserId) {
        if (userAccountRepository.findByUserId(newUserId).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));
        user.setUserId(newUserId);
        userAccountRepository.save(user);
        return true;
    }

    // 비밀번호 변경
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if (!encoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("기존 비밀번호가 일치하지 않습니다.");
        }
        user.setPassword(encoder.encode(newPassword));
        userAccountRepository.save(user);
        return true;
    }

    // 차단 목록 관리
    public List<Block> getBlockedUsers(Long userId) {
        return blockRepository.findByBlocker_Id(userId);
    }

    public boolean blockUser(Long blockerId, Long blockedId) {
        if (blockRepository.existsByBlocker_IdAndBlocked_Id(blockerId, blockedId)) {
            return false;
        }
        UserAccount blocker = userAccountRepository.findById(blockerId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));
        UserAccount blocked = userAccountRepository.findById(blockedId)
                .orElseThrow(() -> new IllegalArgumentException("차단할 사용자를 찾을 수 없습니다."));
        Block block = new Block(blocker, blocked);
        blockRepository.save(block);
        return true;
    }

    public boolean unblockUser(Long blockerId, Long blockedId) {
        Block block = blockRepository.findByBlocker_IdAndBlocked_Id(blockerId, blockedId)
                .orElseThrow(() -> new IllegalArgumentException("차단 관계가 없습니다."));
        blockRepository.delete(block);
        return true;
    }

    private UserSettings getUserSettings(Long userId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다."));

        return userSettingsRepository.findByUser(user)
                .orElseGet(() -> {
                    // 기본값을 설정하여 새로운 UserSettings 생성 및 저장
                    UserSettings newSettings = new UserSettings(user);
                    return userSettingsRepository.save(newSettings);
                });
    }
    public UserSettings getUserSettings(UserAccount user) {
        return userSettingsRepository.findByUser(user)
                .orElseGet(() -> new UserSettings(user, true, true));
    }

    public void updateUserSettings(UserAccount user, UserSettings settings) {
        // settings 객체에서 알림 설정을 가져와 업데이트
        UserSettings userSettings = userSettingsRepository.findByUser(user)
                .orElseGet(() -> {
                    settings.setUser(user);
                    return userSettingsRepository.save(settings);
                });

        // 설정값 업데이트
        userSettings.setAllowCommentNotifications(settings.isAllowCommentNotifications());
        userSettings.setAllowReplyNotifications(settings.isAllowReplyNotifications());
        userSettingsRepository.save(userSettings);
    }
}
