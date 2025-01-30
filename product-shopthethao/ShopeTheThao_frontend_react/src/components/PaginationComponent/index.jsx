import React from "react";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const PaginationComponent = ({ totalPages, currentPage, setCurrentPage }) => {
  // Hàm lấy danh sách trang cần hiển thị
  const getPages = () => {
    let pages = [];

    if (totalPages <= 6) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
      pages = [1, 2, 3, 4, "...", totalPages];
    } else if (currentPage >= totalPages - 3) {
      pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, totalPages];

      if (currentPage + 2 < totalPages) {
        pages.splice(-1, 0, "...");
      }
    }

    return pages;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 20, gap: 10 }}>
      {/* Nút Trang trước */}
      <Button 
        disabled={currentPage === 1} 
        onClick={() => setCurrentPage(currentPage - 1)}
        style={{
          backgroundColor: "#f0f0f0",
          borderRadius: "50px",
          padding: "6px 14px",
          border: "none",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          color: currentPage === 1 ? "#ccc" : "#000",
          fontSize: "14px",
          transition: "all 0.2s",
        }}
      >
        <FontAwesomeIcon icon={faAngleLeft} /> Trang trước
      </Button>

      {/* Hiển thị số trang */}
      {getPages().map((page, index) => (
        <span
          key={index}
          onClick={() => typeof page === "number" && setCurrentPage(page)}
          style={{
            cursor: typeof page === "number" ? "pointer" : "default",
            padding: "8px 12px",
            margin: "0 4px",
            borderRadius: "8px",
            backgroundColor: page === currentPage ? "#1890ff" : "transparent",
            color: page === currentPage ? "#fff" : "#000",
            fontWeight: "bold",
            fontSize: "14px",
            pointerEvents: typeof page === "number" ? "auto" : "none",
            userSelect: "none",
            transition: "all 0.2s",
            boxShadow: page === currentPage ? "0px 2px 4px rgba(0,0,0,0.2)" : "none",
          }}
        >
          {page}
        </span>
      ))}

      {/* Nút Trang sau */}
      <Button 
        disabled={currentPage === totalPages} 
        onClick={() => setCurrentPage(currentPage + 1)}
        style={{
          backgroundColor: "#f0f0f0",
          borderRadius: "50px",
          padding: "6px 14px",
          border: "none",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          color: currentPage === totalPages ? "#ccc" : "#000",
          fontSize: "14px",
          transition: "all 0.2s",
        }}
      >
        Trang sau <FontAwesomeIcon icon={faAngleRight} />
      </Button>
    </div>
  );
};

export default PaginationComponent;
