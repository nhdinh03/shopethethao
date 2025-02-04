-- Kiểm tra và tạo Database nếu chưa tồn tại
IF NOT EXISTS (SELECT *
FROM sys.databases
WHERE name = 'productShope')
BEGIN
    CREATE DATABASE productShope;
END;
GO
USE productShope;
GO

-- Tạo bảng Accounts (Người dùng)
CREATE TABLE Accounts
(
    id NVARCHAR(20) NOT NULL PRIMARY KEY,
    phone NVARCHAR(15),
    fullname NVARCHAR(100),
    image NVARCHAR(MAX),
    email NVARCHAR(350) NOT NULL UNIQUE,
    address NVARCHAR(MAX),
    password NVARCHAR(255) NOT NULL,
    birthday DATE,
    gender BIT,
    status INT DEFAULT 1 NOT NULL,
    verified BIT DEFAULT 0 NOT NULL,
    created_date DATETIME DEFAULT GETDATE(),
    points INT DEFAULT 0 NOT NULL
);
GO

-- Tạo bảng Roles (Vai trò người dùng)
CREATE TABLE Roles
(
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL UNIQUE,
    description NVARCHAR(MAX)
);
GO

-- Tạo bảng Accounts_Roles (Quan hệ tài khoản và vai trò)
CREATE TABLE Accounts_Roles
(
    account_id NVARCHAR(20) NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (account_id, role_id),
    FOREIGN KEY (account_id) REFERENCES Accounts(id) ,
    FOREIGN KEY (role_id) REFERENCES Roles(id)
);
GO

-- Tạo bảng Verification (Mã xác thực tài khoản)
CREATE TABLE Verification
(
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    account_id NVARCHAR(20) NOT NULL,
    code NVARCHAR(6) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    expires_at DATETIME,
    active BIT DEFAULT 1,
    FOREIGN KEY (account_id) REFERENCES Accounts(id)
);
GO

-- Tạo bảng Categories (Danh mục sản phẩm)
CREATE TABLE Categories
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(200)
);
GO

-- Tạo bảng Products (Sản phẩm)
CREATE TABLE Products
(
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(MAX) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(18,2) NOT NULL,
    description NVARCHAR(MAX),
    status BIT NOT NULL DEFAULT 1,
    image1 NVARCHAR(MAX),
    image2 NVARCHAR(MAX),
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(id)
    ,
);
GO

CREATE TABLE Sizes
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    -- Tự động tăng và khóa chính
    name NVARCHAR(255) NOT NULL UNIQUE
    -- Cột name không được null và phải duy nhất
);


CREATE TABLE Product_Sizes
(
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    product_id INT NOT NULL,
   size_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (product_id) REFERENCES Products(id),
    FOREIGN KEY (size_id) REFERENCES Sizes(id)

);
GO



-- Tạo bảng Comments (Bình luận sản phẩm)
CREATE TABLE Comments
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    content NVARCHAR(MAX),
    like_count INT DEFAULT 0,
    order_date DATE NOT NULL,
    user_id NVARCHAR(20) NOT NULL,
    product_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Accounts(id) ,
    FOREIGN KEY (product_id) REFERENCES Products(id)
);
GO

-- Tạo bảng Invoices (Hóa đơn)
CREATE TABLE Invoices
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_date DATETIME NOT NULL DEFAULT GETDATE(),
    address NVARCHAR(200),
    status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    note NVARCHAR(200),
    user_id NVARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Accounts(id)
);
GO

-- Tạo bảng Detailed_Invoices (Chi tiết hóa đơn)
CREATE TABLE Detailed_Invoices
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    invoice_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    payment_method NVARCHAR(200) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES Invoices(id) ,
    FOREIGN KEY (product_id) REFERENCES Products(id)
);
GO
CREATE TABLE Distinctives
(
    id INT IDENTITY(1,1) NOT NULL,
    name NVARCHAR(MAX)
);


-- Tạo bảng Products_Distinctives
CREATE TABLE Products_Distinctives
(
    id INT IDENTITY(1,1) NOT NULL,
    product_id INT NOT NULL,
    distinctive_id INT NOT NULL
);

-- Tạo bảng Brands (Thương hiệu)
CREATE TABLE Brands
(
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(200) NOT NULL UNIQUE,
    phone_number NVARCHAR(10) NOT NULL,
    email NVARCHAR(100),
    address NVARCHAR(MAX)
);
GO

-- Tạo bảng Suppliers (Nhà cung cấp)
CREATE TABLE Suppliers
(
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(200) NOT NULL UNIQUE,
    phone_number NVARCHAR(10) NOT NULL,
    email NVARCHAR(100),
    address NVARCHAR(MAX)
);
GO

-- Tạo bảng Stock_Receipts (Nhập hàng)
CREATE TABLE Stock_Receipts
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT NOT NULL,
    supplier_id INT NOT NULL,
    brand_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(18,2) NOT NULL,
    order_date DATE NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (product_id) REFERENCES Products(id) ,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(id) ,
    FOREIGN KEY (brand_id) REFERENCES Brands(id)
);
GO

-- Tạo bảng User_Histories
CREATE TABLE User_Histories
(
    id_history INT IDENTITY(1,1) NOT NULL,
    note NVARCHAR(200),
    history_date DATE NOT NULL,
    history_time NVARCHAR(20) NOT NULL,
    user_id NVARCHAR(20) NOT NULL
);