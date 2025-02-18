-- Kiểm tra và tạo Database nếu chưa tồn tại

BEGIN
    CREATE DATABASE productShopesss;
END;
GO
USE productShopesss;
GO

-- Tạo bảng Accounts (Người dùng)
CREATE TABLE Accounts (
    id NVARCHAR(100) NOT NULL PRIMARY KEY, -- Đổi từ NVARCHAR(20) sang INT IDENTITY
    phone NVARCHAR(15) UNIQUE, -- Thêm ràng buộc UNIQUE cho số điện thoại
    fullname NVARCHAR(100),
    image NVARCHAR(MAX),
    email NVARCHAR(350) NOT NULL UNIQUE,
    address NVARCHAR(MAX),
    password NVARCHAR(255) NOT NULL,
    birthday DATE,
    gender CHAR(1) CHECK (gender IN ('M', 'F', 'O')), -- Đổi từ BIT sang CHAR(1)
    status INT DEFAULT 1 NOT NULL,
    verified BIT DEFAULT 0 NOT NULL,
    created_date DATETIME DEFAULT GETDATE(),
    points INT DEFAULT 0 NOT NULL
);
GO

CREATE TABLE dbo.lock_reasons (
    id INT IDENTITY(1,1) PRIMARY KEY,
    account_id NVARCHAR(100) NOT NULL,
    reason NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (account_id) REFERENCES dbo.Accounts(id)
);

-- Tạo bảng Roles (Vai trò người dùng)
CREATE TABLE Roles (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL UNIQUE,
    description NVARCHAR(MAX)
);
GO

-- Tạo bảng Accounts_Roles (Quan hệ tài khoản và vai trò)
CREATE TABLE Accounts_Roles (
    account_id NVARCHAR(100)  NOT NULL, -- Đổi từ NVARCHAR(20) sang INT
    role_id BIGINT NOT NULL,
    PRIMARY KEY (account_id, role_id),
    FOREIGN KEY (account_id) REFERENCES Accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE
);
GO

-- Tạo bảng Verification (Mã xác thực tài khoản)
CREATE TABLE Verification (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    account_id NVARCHAR(100)  NOT NULL, -- Đổi từ NVARCHAR(20) sang INT
    code NVARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    expires_at DATETIME,
    active BIT DEFAULT 1,
    FOREIGN KEY (account_id) REFERENCES Accounts(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_verification_account_id ON Verification(account_id); -- Thêm chỉ mục

-- Tạo bảng Categories (Danh mục sản phẩm)
CREATE TABLE Categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(200)
);
GO

-- Tạo bảng Products (Sản phẩm)
CREATE TABLE Products (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(MAX) NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 0), -- Thêm ràng buộc CHECK
    price DECIMAL(18,2) NOT NULL CHECK (price >= 0), -- Thêm ràng buộc CHECK
    description NVARCHAR(MAX),
    status BIT NOT NULL DEFAULT 1,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE)
GO

-- Tạo bảng Suppliers (Nhà cung cấp)
CREATE TABLE Suppliers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL UNIQUE,
    phone_number NVARCHAR(10) NOT NULL,
    email NVARCHAR(100),
    address NVARCHAR(MAX)
);
GO

-- Tạo bảng Brands (Thương hiệu)
CREATE TABLE Brands (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL UNIQUE,
    phone_number NVARCHAR(10) NOT NULL,
    email NVARCHAR(100),
    address NVARCHAR(MAX)
);
GO


-- Tạo bảng Stock_Receipts (Nhập hàng)
GO
CREATE TABLE Stock_Receipts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id INT NOT NULL,
    brand_id INT NOT NULL,
    order_date DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (brand_id) REFERENCES Brands(id) ON DELETE CASCADE,
);
GO


CREATE TABLE Receipt_Products (
    receipt_id INT,
    product_id INT,
    quantity INT NOT NULL CHECK (quantity >= 0),
    price DECIMAL(15, 2) NOT NULL CHECK (price >= 0),
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (receipt_id, product_id),
    FOREIGN KEY (receipt_id) REFERENCES Stock_Receipts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    CONSTRAINT CHK_TotalAmount CHECK (total_amount = quantity * price) -- Ràng buộc tính toán
);



CREATE INDEX idx_products_category_id ON Products(category_id); -- Thêm chỉ mục

-- Tạo bảng Product_Images (Hình ảnh sản phẩm)
CREATE TABLE Product_Images (
    id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT NOT NULL,
    image_url NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);
GO

-- Tạo bảng Sizes (Kích thước sản phẩm)
CREATE TABLE Sizes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL UNIQUE
);
GO

-- Tạo bảng Product_Sizes (Quan hệ sản phẩm và kích thước)
CREATE TABLE Product_Sizes (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    product_id INT NOT NULL,
    size_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0), -- Thêm ràng buộc CHECK
    price DECIMAL(18,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0), -- Thêm ràng buộc CHECK
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES Sizes(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_product_sizes_product_id ON Product_Sizes(product_id); -- Thêm chỉ mục

-- Tạo bảng Comments (Bình luận sản phẩm)
CREATE TABLE Comments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    content NVARCHAR(MAX),
    like_count INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(), -- Thêm trường created_at
    user_id NVARCHAR(100)  NOT NULL, -- Đổi từ NVARCHAR(20) sang INT
    product_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);
GO

-- Tạo bảng Invoices (Hóa đơn)
CREATE TABLE Invoices (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_date DATETIME NOT NULL DEFAULT GETDATE(),
    address NVARCHAR(200),
    status NVARCHAR(50) NOT NULL DEFAULT 'PENDING',
    note NVARCHAR(200),                    -- Changed from 'node' to 'note'
    total_amount DECIMAL(18,2) NOT NULL DEFAULT 0.00,  -- Changed from 'totalAmount' to 'total_amount'
    user_id NVARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (cancel_reason_id) REFERENCES cancel_reasons(id) ON DELETE SET NULL,
    CONSTRAINT CHK_Invoice_Status CHECK (status IN ('PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED'))
);
GO

--ly do huy
CREATE TABLE CancelReasons (
    id INT IDENTITY(1,1) PRIMARY KEY,
    reason NVARCHAR(255) NOT NULL UNIQUE
);


-- Recreate Detailed_Invoices table with correct column names
CREATE TABLE Detailed_Invoices (
    id INT IDENTITY(1,1) PRIMARY KEY,
    invoice_id INT NOT NULL,
    product_id INT NOT NULL,
    size_id INT NOT NULL,  -- Thêm cột size_id
    quantity INT NOT NULL CHECK (quantity >= 0),
    unit_price DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    payment_method NVARCHAR(200) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES Invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES Sizes(id) ON DELETE CASCADE  -- Thêm khóa ngoại đến bảng Sizes
);
CREATE INDEX IX_DetailedInvoices_InvoiceId ON Detailed_Invoices(invoice_id);
CREATE INDEX IX_DetailedInvoices_ProductSize ON Detailed_Invoices(product_id, size_id);

CREATE INDEX IX_Invoices_Status ON Invoices(status);
CREATE INDEX IX_Invoices_UserId ON Invoices(user_id);
CREATE INDEX IX_DetailedInvoices_InvoiceId ON Detailed_Invoices(invoice_id);
GO

-- Tạo bảng Product_Attributes (Đặc điểm sản phẩm)
CREATE TABLE Product_Attributes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(MAX) NOT NULL
);
GO

-- Tạo bảng Product_Attribute_Mappings (Quan hệ sản phẩm và đặc điểm)
CREATE TABLE Product_Attribute_Mappings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT NOT NULL,
    attribute_id INT NOT NULL,
	UNIQUE(product_id, attribute_id), 
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES Product_Attributes(id) ON DELETE CASCADE
);
GO




-- Tạo bảng User_Histories (Lịch sử người dùng)
CREATE TABLE User_Histories (
    id_history INT IDENTITY(1,1) PRIMARY KEY,
    note NVARCHAR(200),
    history_datetime DATETIME NOT NULL DEFAULT GETDATE(), -- Kết hợp date và time
    user_id NVARCHAR(100)  NOT NULL, -- Đổi từ NVARCHAR(20) sang INT
    FOREIGN KEY (user_id) REFERENCES Accounts(id) ON DELETE CASCADE
);
GO

-- Thêm dữ liệu mẫu cho Roles
INSERT INTO Roles (name, description) VALUES
(N'Role1', N'Description 1'),
(N'Role2', N'Description 2'),
(N'Role3', N'Description 3'),
(N'Role4', N'Description 4'),
(N'Role5', N'Description 5'),
(N'Role6', N'Description 6'),
(N'Role7', N'Description 7'),
(N'Role8', N'Description 8'),
(N'Role9', N'Description 9'),
(N'Role10', N'Description 10');

-- Thêm dữ liệu mẫu cho Accounts
INSERT INTO Accounts (id, phone, fullname, email, password, birthday, gender) VALUES
(N'U1', N'0123450001', N'User 1', N'user1@mail.com', N'pass1', '1990-01-01', 'M'),
(N'U2', N'0123450002', N'User 2', N'user2@mail.com', N'pass2', '1991-02-02', 'F'),
(N'U3', N'0123450003', N'User 3', N'user3@mail.com', N'pass3', '1992-03-03', 'M'),
(N'U4', N'0123450004', N'User 4', N'user4@mail.com', N'pass4', '1993-04-04', 'F'),
(N'U5', N'0123450005', N'User 5', N'user5@mail.com', N'pass5', '1994-05-05', 'O'),
(N'U6', N'0123450006', N'User 6', N'user6@mail.com', N'pass6', '1995-06-06', 'M'),
(N'U7', N'0123450007', N'User 7', N'user7@mail.com', N'pass7', '1996-07-07', 'F'),
(N'U8', N'0123450008', N'User 8', N'user8@mail.com', N'pass8', '1997-08-08', 'M'),
(N'U9', N'0123450009', N'User 9', N'user9@mail.com', N'pass9', '1998-09-09', 'O'),
(N'U10', N'0123450010', N'User 10', N'user10@mail.com', N'pass10', '1999-10-10', 'M');

-- Thêm dữ liệu mẫu cho Accounts_Roles (mỗi account có 1 role tương ứng)
INSERT INTO Accounts_Roles (account_id, role_id) VALUES
(N'U1', 1),
(N'U2', 2),
(N'U3', 3),
(N'U4', 4),
(N'U5', 5),
(N'U6', 6),
(N'U7', 7),
(N'U8', 8),
(N'U9', 9),
(N'U10', 10);

-- Thêm dữ liệu mẫu cho Verification
INSERT INTO Verification (account_id, code, expires_at) VALUES
(N'U1', N'CODE01', DATEADD(DAY, 14, GETDATE())),
(N'U2', N'CODE02', DATEADD(DAY, 14, GETDATE())),
(N'U3', N'CODE03', DATEADD(DAY, 14, GETDATE())),
(N'U4', N'CODE04', DATEADD(DAY, 14, GETDATE())),
(N'U5', N'CODE05', DATEADD(DAY, 14, GETDATE())),
(N'U6', N'CODE06', DATEADD(DAY, 14, GETDATE())),
(N'U7', N'CODE07', DATEADD(DAY, 14, GETDATE())),
(N'U8', N'CODE08', DATEADD(DAY, 14, GETDATE())),
(N'U9', N'CODE09', DATEADD(DAY, 14, GETDATE())),
(N'U10', N'CODE10', DATEADD(DAY, 14, GETDATE()));

-- Thêm dữ liệu mẫu cho Categories
INSERT INTO Categories (name, description) VALUES
(N'Category1', N'Desc 1'),
(N'Category2', N'Desc 2'),
(N'Category3', N'Desc 3'),
(N'Category4', N'Desc 4'),
(N'Category5', N'Desc 5'),
(N'Category6', N'Desc 6'),
(N'Category7', N'Desc 7'),
(N'Category8', N'Desc 8'),
(N'Category9', N'Desc 9'),
(N'Category10', N'Desc 10');

-- Thêm dữ liệu mẫu cho Products (chỉ rõ category_id 1..10)
INSERT INTO Products (name, quantity, price, description, category_id) VALUES
(N'Product1', 10, 10000, N'Product Desc 1', 1),
(N'Product2', 20, 20000, N'Product Desc 2', 2),
(N'Product3', 30, 30000, N'Product Desc 3', 3),
(N'Product4', 40, 40000, N'Product Desc 4', 4),
(N'Product5', 50, 50000, N'Product Desc 5', 5),
(N'Product6', 60, 60000, N'Product Desc 6', 6),
(N'Product7', 70, 70000, N'Product Desc 7', 7),
(N'Product8', 80, 80000, N'Product Desc 8', 8),
(N'Product9', 90, 90000, N'Product Desc 9', 9),
(N'Product10', 100, 100000, N'Product Desc 10', 10);

-- Thêm dữ liệu mẫu cho Suppliers
INSERT INTO Suppliers (name, phone_number, email, address) VALUES
(N'Supplier1', N'0999000001', N'sup1@mail.com', N'Address 1'),
(N'Supplier2', N'0999000002', N'sup2@mail.com', N'Address 2'),
(N'Supplier3', N'0999000003', N'sup3@mail.com', N'Address 3'),
(N'Supplier4', N'0999000004', N'sup4@mail.com', N'Address 4'),
(N'Supplier5', N'0999000005', N'sup5@mail.com', N'Address 5'),
(N'Supplier6', N'0999000006', N'sup6@mail.com', N'Address 6'),
(N'Supplier7', N'0999000007', N'sup7@mail.com', N'Address 7'),
(N'Supplier8', N'0999000008', N'sup8@mail.com', N'Address 8'),
(N'Supplier9', N'0999000009', N'sup9@mail.com', N'Address 9'),
(N'Supplier10',N'0999000010', N'sup10@mail.com',N'Address 10');

-- Thêm dữ liệu mẫu cho Brands
INSERT INTO Brands (name, phone_number, email, address) VALUES
(N'Brand1', N'0888000001', N'brand1@mail.com', N'Brand Addr 1'),
(N'Brand2', N'0888000002', N'brand2@mail.com', N'Brand Addr 2'),
(N'Brand3', N'0888000003', N'brand3@mail.com', N'Brand Addr 3'),
(N'Brand4', N'0888000004', N'brand4@mail.com', N'Brand Addr 4'),
(N'Brand5', N'0888000005', N'brand5@mail.com', N'Brand Addr 5'),
(N'Brand6', N'0888000006', N'brand6@mail.com', N'Brand Addr 6'),
(N'Brand7', N'0888000007', N'brand7@mail.com', N'Brand Addr 7'),
(N'Brand8', N'0888000008', N'brand8@mail.com', N'Brand Addr 8'),
(N'Brand9', N'0888000009', N'brand9@mail.com', N'Brand Addr 9'),
(N'Brand10',N'0888000010', N'brand10@mail.com',N'Brand Addr 10');

-- Thêm dữ liệu mẫu cho Stock_Receipts (tham chiếu supplier_id, brand_id)
INSERT INTO Stock_Receipts (supplier_id, brand_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

-- Thêm dữ liệu mẫu cho Receipt_Products
INSERT INTO Receipt_Products (receipt_id, product_id, quantity, price) VALUES
(1, 1, 10, 10000),
(2, 2, 20, 20000),
(3, 3, 30, 30000),
(4, 4, 40, 40000),
(5, 5, 50, 50000),
(6, 6, 60, 60000),
(7, 7, 70, 70000),
(8, 8, 80, 80000),
(9, 9, 90, 90000),
(10, 10, 100, 100000);

-- Thêm dữ liệu mẫu cho Product_Images
INSERT INTO Product_Images (product_id, image_url) VALUES
(1, N'https://example.com/img1.jpg'),
(2, N'https://example.com/img2.jpg'),
(3, N'https://example.com/img3.jpg'),
(4, N'https://example.com/img4.jpg'),
(5, N'https://example.com/img5.jpg'),
(6, N'https://example.com/img6.jpg'),
(7, N'https://example.com/img7.jpg'),
(8, N'https://example.com/img8.jpg'),
(9, N'https://example.com/img9.jpg'),
(10,N'https://example.com/img10.jpg');

-- Thêm dữ liệu mẫu cho Sizes
INSERT INTO Sizes (name) VALUES
(N'Size1'),
(N'Size2'),
(N'Size3'),
(N'Size4'),
(N'Size5'),
(N'Size6'),
(N'Size7'),
(N'Size8'),
(N'Size9'),
(N'Size10');

-- Thêm dữ liệu mẫu cho Product_Sizes (tham chiếu product_id, size_id)
INSERT INTO Product_Sizes (product_id, size_id, quantity, price) VALUES
(1, 1, 10, 10000),
(2, 2, 20, 20000),
(3, 3, 30, 30000),
(4, 4, 40, 40000),
(5, 5, 50, 50000),
(6, 6, 60, 60000),
(7, 7, 70, 70000),
(8, 8, 80, 80000),
(9, 9, 90, 90000),
(10, 10, 100, 100000);

-- Thêm dữ liệu mẫu cho Comments (tham chiếu user_id, product_id)
INSERT INTO Comments (content, user_id, product_id) VALUES
(N'Comment1', N'U1', 1),
(N'Comment2', N'U2', 2),
(N'Comment3', N'U3', 3),
(N'Comment4', N'U4', 4),
(N'Comment5', N'U5', 5),
(N'Comment6', N'U6', 6),
(N'Comment7', N'U7', 7),
(N'Comment8', N'U8', 8),
(N'Comment9', N'U9', 9),
(N'Comment10',N'U10',10);

-- Thêm dữ liệu mẫu cho CancelReasons
INSERT INTO CancelReasons (reason) VALUES
(N'Lý do huỷ 1'),
(N'Lý do huỷ 2'),
(N'Lý do huỷ 3'),
(N'Lý do huỷ 4'),
(N'Lý do huỷ 5'),
(N'Lý do huỷ 6'),
(N'Lý do huỷ 7'),
(N'Lý do huỷ 8'),
(N'Lý do huỷ 9'),
(N'Lý do huỷ 10');

-- Thêm dữ liệu mẫu cho Invoices (tham chiếu user_id)
INSERT INTO Invoices (address, user_id) VALUES
(N'Address1', N'U1'),
(N'Address2', N'U2'),
(N'Address3', N'U3'),
(N'Address4', N'U4'),
(N'Address5', N'U5'),
(N'Address6', N'U6'),
(N'Address7', N'U7'),
(N'Address8', N'U8'),
(N'Address9', N'U9'),
(N'Address10',N'U10');

-- Thêm dữ liệu mẫu cho Detailed_Invoices (tham chiếu invoice_id, product_id, size_id)
INSERT INTO Detailed_Invoices (invoice_id, product_id, size_id, quantity, payment_method) VALUES
(1, 1, 1, 2, N'Cash'),
(2, 2, 2, 2, N'Credit Card'),
(3, 3, 3, 3, N'Cash'),
(4, 4, 4, 4, N'Credit Card'),
(5, 5, 5, 5, N'Cash'),
(6, 6, 6, 6, N'Credit Card'),
(7, 7, 7, 7, N'Cash'),
(8, 8, 8, 8, N'Credit Card'),
(9, 9, 9, 9, N'Cash'),
(10,10,10,10,N'Credit Card');

-- Thêm dữ liệu mẫu cho Product_Attributes
INSERT INTO Product_Attributes (name) VALUES
(N'Attribute1'),
(N'Attribute2'),
(N'Attribute3'),
(N'Attribute4'),
(N'Attribute5'),
(N'Attribute6'),
(N'Attribute7'),
(N'Attribute8'),
(N'Attribute9'),
(N'Attribute10');

-- Thêm dữ liệu mẫu cho Product_Attribute_Mappings (tham chiếu product_id, attribute_id)
INSERT INTO Product_Attribute_Mappings (product_id, attribute_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10,10);

-- Thêm dữ liệu mẫu cho User_Histories (tham chiếu user_id)
INSERT INTO User_Histories (note, user_id) VALUES
(N'History 1', N'U1'),
(N'History 2', N'U2'),
(N'History 3', N'U3'),
(N'History 4', N'U4'),
(N'History 5', N'U5'),
(N'History 6', N'U6'),
(N'History 7', N'U7'),
(N'History 8', N'U8'),
(N'History 9', N'U9'),
(N'History 10',N'U10');

