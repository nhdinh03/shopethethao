package com.shopethethao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDTO {

    private Integer productId;
    private String productName;
    private String attributeName;
    private String sizeName;
    private Integer quantity;
    private Integer price;

}
