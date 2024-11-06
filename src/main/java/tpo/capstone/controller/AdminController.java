package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.entity.Report;
import tpo.capstone.repository.ReportRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ReportRepository reportRepository;

    /**
     * 모든 신고 내역 조회 (페이징 가능)
     *
     * @param page 페이지 번호 (기본값: 0)
     * @param size 페이지 크기 (기본값: 10)
     * @return 신고 내역 페이지
     */
    @GetMapping("/reports")
    public ResponseEntity<Page<Report>> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("reportedAt").descending());
        Page<Report> reports = reportRepository.findAll(pageable);
        return ResponseEntity.ok(reports);
    }

    /**
     * 특정 유형의 신고 내역 조회 (필터링 가능)
     *
     * @param targetType 신고 대상 유형 ('POST' 또는 'COMMENT')
     * @param page       페이지 번호 (기본값: 0)
     * @param size       페이지 크기 (기본값: 10)
     * @return 필터링된 신고 내역 페이지
     */
    @GetMapping("/reports/filter")
    public ResponseEntity<Page<Report>> getReportsByTargetType(
            @RequestParam String targetType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("reportedAt").descending());
        Page<Report> reports = reportRepository.findByTargetType(targetType, pageable);
        return ResponseEntity.ok(reports);
    }
}