package com.shopethethao.auth.models;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum SecurityERole {
    ADMIN,
    USER,
    MANAGER,
    SUPPLIER,
    STAFF;

    public static SecurityERole fromString(String role) {
        try {
            return SecurityERole.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Role không hợp lệ: " + role);
        }
    }

    public static List<String> getAllowedValues() {
        return Arrays.stream(SecurityERole.values())
                    .map(Enum::name)
                    .collect(Collectors.toList());
    }
}