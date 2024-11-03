package tpo.capstone.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import tpo.capstone.entity.UserAccount;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final UserAccount user;

    public CustomUserDetails(UserAccount user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER")); // 기본 권한 설정
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUserId();
    }

    public String getNickname() {
        return user.getNickname();
    }

    public String getEmail() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 계정 만료 상태
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정 잠금 상태
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 자격 증명 만료 상태
    }

    @Override
    public boolean isEnabled() {
        return true; // 계정 활성 상태
    }

    public UserAccount getUser() {
        return user;
    }

    public Long getId() {
        return user.getId(); // 사용자 ID 반환
    }
}