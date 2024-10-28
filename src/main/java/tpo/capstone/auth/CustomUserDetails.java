package tpo.capstone.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import tpo.capstone.entity.UserAccount;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final UserAccount user;

    public CustomUserDetails(UserAccount user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 권한을 반환하는 메서드. 현재는 빈 리스트를 반환하고 있지만, 필요에 따라 사용자 권한을 추가할 수 있음.
        return Collections.emptyList();
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
        return true; // 계정이 만료되지 않았는지 여부를 반환
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정이 잠기지 않았는지 여부를 반환
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 자격 증명이 만료되지 않았는지 여부를 반환
    }

    @Override
    public boolean isEnabled() {
        return true; // 계정이 활성화되었는지 여부를 반환
    }

    public UserAccount getUser() {
        return user; // UserAccount 객체를 반환하는 메서드
    }
}