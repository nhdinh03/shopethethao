package com.shopethethao.auth.models;

public enum SecurityERole {
    ADMIN,
    USER,
    MANAGER,
    SUPPLIER,
    STAFF;

    public static SecurityERole fromString(String role) {
        for (SecurityERole securityRole : SecurityERole.values()) {
            if (securityRole.name().equalsIgnoreCase(role)) {
                return securityRole;
            }
        }
        throw new IllegalArgumentException("Không tìm thấy vai trò với tên: " + role);
    }
}