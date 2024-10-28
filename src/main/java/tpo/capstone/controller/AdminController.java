package tpo.capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tpo.capstone.entity.Report;
import tpo.capstone.repository.ReportRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ReportRepository reportRepository;

    // 모든 신고 내역 조회
    @GetMapping("/reports")
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }
}