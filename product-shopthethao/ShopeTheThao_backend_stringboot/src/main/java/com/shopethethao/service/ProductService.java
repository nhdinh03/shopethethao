package com.shopethethao.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopethethao.dto.ProductDetailDTO;
import com.shopethethao.modules.products.ProductsDAO;

@Service
public class ProductService {
    @Autowired
    private ProductsDAO productsDAO;

    public List<ProductDetailDTO> getProductDetailsById(Integer productId) {
        return productsDAO.findProductDetailsById(productId);
    }
}
