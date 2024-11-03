package tpo.capstone.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import tpo.capstone.auth.CustomUserDetails;
import tpo.capstone.entity.UserAccount;
import tpo.capstone.repository.UserAccountRepository;

import java.util.ArrayList;

@Service
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserAccountRepository userAccountRepository;

    public CustomUserDetailsService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    /**
     * userId로 UserAccount 엔티티를 로드하여 UserDetails 반환.
     * @param userId 로그인용 사용자 ID
     * @return UserDetails 객체
     * @throws UsernameNotFoundException 사용자 ID가 없을 때 예외 발생
     */
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        return userAccountRepository.findByUserId(userId)
                .map(CustomUserDetails::new)
                .orElseThrow(() -> {
                    log.warn("User not found with userId: {}", userId);
                    return new UsernameNotFoundException("User not found with userId: " + userId);
                });
    }
}