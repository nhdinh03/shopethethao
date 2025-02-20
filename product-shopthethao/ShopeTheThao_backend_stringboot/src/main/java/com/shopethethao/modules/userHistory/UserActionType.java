package com.shopethethao.modules.userHistory;

public enum UserActionType {
    LOGIN("Đăng nhập hệ thống"),
    LOGOUT("Đăng xuất hệ thống"),
    CREATE_ORDER("Tạo đơn hàng"),
    UPDATE_ORDER("Cập nhật đơn hàng"),
    CANCEL_ORDER("Hủy đơn hàng"),
    PROCESS_ORDER("Xử lý đơn hàng"),
    UPDATE_PROFILE("Cập nhật thông tin cá nhân"),
    CHANGE_PASSWORD("Thay đổi mật khẩu"),
    ADD_PRODUCT("Thêm sản phẩm"),
    UPDATE_PRODUCT("Cập nhật sản phẩm"),
    DELETE_PRODUCT("Xóa sản phẩm"),
    ADD_COMMENT("Thêm bình luận"),
    DELETE_COMMENT("Xóa bình luận");

    private final String description;

    UserActionType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}