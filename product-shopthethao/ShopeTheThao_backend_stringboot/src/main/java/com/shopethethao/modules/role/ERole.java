package com.shopethethao.modules.role;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum ERole {
    ADMIN,
    USER,
    MANAGER,
    SUPPLIER,
    STAFF;

    public static ERole fromString(String role) {
        try {
            return ERole.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Role không hợp lệ: " + role);
        }
    }

    public static List<String> getAllowedValues() {
        return Arrays.stream(ERole.values())
                    .map(Enum::name)
                    .collect(Collectors.toList());
    }
}