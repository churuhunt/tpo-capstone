/*
package tpo.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 서비스가 아닌 다른 클래스를 만들어 호출하는 방법
@Service
public class PurchaseService {

    @Autowired
    private UserAccountService userAccountService;

    @Transactional
    public String performPurchase(String userId, Long itemId) {
        return userAccountService.purchaseItem(userId, itemId); // 다른 서비스 호출
    }
}
*/
