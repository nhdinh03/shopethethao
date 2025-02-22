package com.shopethethao.modules.userHistory;

public enum UserActionType {
    LOGIN, // Đăng nhập
    LOGOUT, // Đăng xuất
    LOGIN_FAILED, // Đăng nhập thất bại
    RELOGIN, // Đăng nhập lại sau khi đăng xuất

    CREATE_ACCOUNT, // Tạo tài khoản mới
    UPDATE_ACCOUNT, // Cập nhật tài khoản
    DELETE_ACCOUNT, // Xóa tài khoản

    // LOCK_ACCOUNT, // Khóa tài khoản
    // UNLOCK_ACCOUNT, // Mở khóa tài khoản

    CREATE_ACCOUNTSTAFF, // Tạo tài khoản mới NV
    UPDATE_ACCOUNTSTAFF, // Cập nhật tài khoản NV
    DELETE_ACCOUNTSTAFF, // Xóa tài khoản NV

    CREATE_PRODUCT, // Thêm sản phẩm mới
    UPDATE_PRODUCT, // Cập nhật sản phẩm
    DELETE_PRODUCT, // Xóa sản phẩm

    CREATE_BRAND, // Thêm thương hiệu mới
    UPDATE_BRAND, // Cập thương hiệu phẩm
    DELETE_BRAND, // Xóa thương hiệu

    CREATE_SUPPLIER, // Thêm Nhà cung cấp mới
    UPDATE_SUPPLIER, // Cập Nhà cung cấ phẩm
    DELETE_SUPPLIER, // Xóa Nhà cung cấ

    CREATE_SIZE, // Thêm size mới
    UPDATE_SIZE, // Cập nhật size
    DELETE_SIZE, // Xóa size

    CREATE_ROLE, // Thêm role mới
    UPDATE_ROLE, // Cập nhật role
    DELETE_ROLE, // Xóa role

    CREATE_STOCK_RECEIPT, // Tạo phiếu nhập kho
    UPDATE_STOCK_RECEIPT, // Cập nhật phiếu nhập kho
    DELETE_STOCK_RECEIPT, // Xóa phiếu nhập kho

    CREATE_CATEGORIE, // Tạo danh mục
    UPDATE_CATEGORIE, // Cập nhật danh mục
    DELETE_CATEGORIE, // Xóa danh mục

    CREATE_PRODUCTATTRIBUTES, // Tạo đặc trưng sản phẩm
    UPDATE_PRODUCTATTRIBUTES, // Cập nhật đặc trưng sản phẩm
    DELETE_PRODUCTATTRIBUTES; // Xóa đặc trưng sản phẩm


    public boolean isAuthAction() {
        return this == LOGIN || this == LOGOUT || 
               this == LOGIN_FAILED || this == RELOGIN;
    }

    public boolean isAdminAction() {
        return this.name().startsWith("CREATE_") || 
               this.name().startsWith("UPDATE_") || 
               this.name().startsWith("DELETE_");
    }
}