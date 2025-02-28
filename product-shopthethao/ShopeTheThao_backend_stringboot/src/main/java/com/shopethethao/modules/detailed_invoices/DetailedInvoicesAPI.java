package com.shopethethao.modules.detailed_invoices;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopethethao.dto.ResponseDTO;

@RestController
@RequestMapping("/api/detailedInvoices")
public class DetailedInvoicesAPI {

    @Autowired
    private DetailedInvoicesDAO detailedInvoicesDAO;

    @GetMapping("/get/all")
    public ResponseEntity<List<DetailedInvoices>> findAll() {
        List<DetailedInvoices> detailedInvoices = detailedInvoicesDAO.findAll();
        return ResponseEntity.ok(detailedInvoices);
    }

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam("page") Optional<Integer> pageNo,
            @RequestParam("limit") Optional<Integer> limit) {
        try {
            if (pageNo.isPresent() && pageNo.get() == 0) {
                return new ResponseEntity<>("Không tìm thấy trang", HttpStatus.NOT_FOUND);
            }

            Sort sort = Sort.by(Sort.Order.desc("id"));
            Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
            Page<DetailedInvoices> page = detailedInvoicesDAO.findAll(pageable);

            ResponseDTO<DetailedInvoices> responseDTO = new ResponseDTO<>();
            responseDTO.setData(page.getContent());
            responseDTO.setTotalItems(page.getTotalElements());
            responseDTO.setTotalPages(page.getTotalPages());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi máy chủ, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // API lấy chi tiết hóa đơn theo ID
    @GetMapping("/{id}")
    public ResponseEntity<DetailedInvoices> findById(@PathVariable Integer id) {
        Optional<DetailedInvoices> detailedInvoice = detailedInvoicesDAO.findById(id);

        if (detailedInvoice.isPresent()) {
            return ResponseEntity.ok(detailedInvoice.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
