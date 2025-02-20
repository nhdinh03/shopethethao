package com.shopethethao.modules.account;

public enum Gender {
    M("Male"),
    F("Female"),
    O("Other");

    private final String value;

    Gender(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}

