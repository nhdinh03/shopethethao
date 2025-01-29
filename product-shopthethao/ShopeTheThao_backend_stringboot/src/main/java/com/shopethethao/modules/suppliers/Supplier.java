package com.shopethethao.modules.suppliers;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false, length = 200)
    private String name;
    
    @Column(name = "phone_number", nullable = false, length = 10)
    private String phoneNumber;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "address")
    private String address;
}
