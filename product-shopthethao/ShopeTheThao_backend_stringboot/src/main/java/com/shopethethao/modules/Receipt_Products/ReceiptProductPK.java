package com.shopethethao.modules.Receipt_Products;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class ReceiptProductPK implements Serializable {

    @Column(name = "receipt_id")
    private Integer receiptId;

    @Column(name = "product_id")
    private Integer productId;



    
}