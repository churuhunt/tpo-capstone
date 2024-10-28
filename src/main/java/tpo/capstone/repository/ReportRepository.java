package tpo.capstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {
    // 관리자가 신고 내역을 조회할 수 있는 추가적인 메서드를 정의할 수 있습니다.
}