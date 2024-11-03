package tpo.capstone.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tpo.capstone.entity.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {
    // targetType으로 필터링하여 페이징된 결과를 반환하는 메서드 정의
    Page<Report> findByTargetType(String targetType, Pageable pageable);
}