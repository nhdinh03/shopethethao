import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import { productsApi } from "api/Admin";

const HomePage = () => {
  const [productId, setProductId] = useState(""); // Trạng thái để lưu id người dùng nhập vào
  const [product, setProduct] = useState(null); // Trạng thái để lưu thông tin chi tiết sản phẩm

  // Hàm gọi API để lấy thông tin sản phẩm khi người dùng nhấn nút
  const fetchProductDetails = async () => {
    if (productId) {
      try {
        const data = await productsApi.getProductDetails(productId); // Gọi API để lấy chi tiết sản phẩm
        if (data) {
          setProduct(data); // Cập nhật dữ liệu sản phẩm nếu tìm thấy
        } else {
          console.log("Không có dữ liệu cho sản phẩm với ID:", productId);
          setProduct(null); // Nếu không có dữ liệu, set lại sản phẩm là null
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      }
    } else {
      console.log("Vui lòng nhập productId");
    }
  };

  return (
    <div className="container">
      {/* Input để người dùng nhập productId */}
      <Input
        type="number"
        placeholder="Nhập ID sản phẩm"
        value={productId}
        onChange={(e) => setProductId(e.target.value)} // Cập nhật productId khi người dùng nhập
        style={{ marginBottom: "10px", width: "200px" }}
      />
      
      {/* Button để gọi API và lấy dữ liệu sản phẩm */}
      <Button type="primary" onClick={fetchProductDetails}>
        Lấy Chi Tiết Sản Phẩm
      </Button>

      {/* Hiển thị chi tiết sản phẩm nếu có */}
      {product ? (
        <div>
          <h1>{product.name}</h1>
          <p><strong>Giá:</strong> {product.price}</p>
          <p><strong>Kích thước:</strong> {product.sizes ? product.sizes.map(size => size.name).join(", ") : "Không có kích thước"}</p>
          <p><strong>Thuộc tính:</strong> {product.attributes ? product.attributes.join(", ") : "Không có thuộc tính"}</p>
        </div>
      ) : (
        <p>Vui lòng nhập ID sản phẩm và nhấn "Lấy Chi Tiết Sản Phẩm".</p>
      )}
    </div>
  );
};

export default HomePage;
