package com.shopethethao.modules.suppliers;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SupplierDAO extends JpaRepository<Supplier, String> {

}
