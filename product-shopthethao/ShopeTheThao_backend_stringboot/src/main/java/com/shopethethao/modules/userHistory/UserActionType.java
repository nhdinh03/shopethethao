package com.shopethethao.modules.userHistory;

public enum UserActionType {
    LOGIN,           // Đăng nhập
    LOGOUT,          // Đăng xuất
    LOGIN_FAILED,    // Đăng nhập thất bại
    RELOGIN,         // Đăng nhập lại sau khi đăng xuất

    CREATE_PRODUCT,    // Thêm sản phẩm mới
    UPDATE_PRODUCT,    // Cập nhật sản phẩm
    DELETE_PRODUCT,    // Xóa sản phẩm
    
    CREATE_SIZE,    // Thêm size mới
    UPDATE_SIZE,    // Cập nhật size
    DELETE_SIZE,    // Xóa size

    CREATE_ROLE,    // Thêm role mới
    UPDATE_ROLE,    // Cập nhật role
    DELETE_ROLE,    // Xóa role

    CREATE_ACCOUNT,     // Tạo tài khoản mới
    UPDATE_ACCOUNT,     // Cập nhật tài khoản
    DELETE_ACCOUNT,     // Xóa tài khoản
    // LOCK_ACCOUNT,       // Khóa tài khoản
    // UNLOCK_ACCOUNT,     // Mở khóa tài khoản
    

    
}