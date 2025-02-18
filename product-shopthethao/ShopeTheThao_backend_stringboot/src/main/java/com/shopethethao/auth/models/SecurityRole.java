// package com.shopethethao.auth.models;

// import java.util.List;

// import com.fasterxml.jackson.annotation.JsonIgnore;
// import com.shopethethao.modules.accountRole.AccountRole;

// import jakarta.persistence.*;
// import lombok.Data;

// @Data
// @Entity
// @Table(name = "roles")
// public class SecurityRole {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Enumerated(EnumType.STRING)
//     @Column(length = 20)
//     private SecurityERole name;

//     private String description;

//     @JsonIgnore
//     @OneToMany(mappedBy = "role")
//     private List<AccountRole> accountRoles;

   
// }
