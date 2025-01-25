CREATE DATABASE productShope;
GO
USE productShope;
GO

-- Tạo bảng Accounts
CREATE TABLE Accounts (
    id NVARCHAR(20) NOT NULL,
    phone NVARCHAR(15),
    fullname NVARCHAR(100),
    [image] NVARCHAR(MAX),
    email NVARCHAR(350) NOT NULL,
    [address] NVARCHAR(MAX),
    [password] NVARCHAR(255) NOT NULL,
    birthday DATE,
    gender BIT,
    [status] INT,
    verified BIT,
    created_date DATETIME,
    points INT
);

-- Tạo bảng Roles
CREATE TABLE Roles (
    id BIGINT IDENTITY(1,1) NOT NULL,
    [name] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX)
);

-- Tạo bảng Accounts_Roles
CREATE TABLE Accounts_Roles (
    account_id NVARCHAR(20) NOT NULL,
    role_id BIGINT NOT NULL
);

-- Tạo bảng Verification
CREATE TABLE Verification (
    id BIGINT IDENTITY(1,1) NOT NULL,
    account_id NVARCHAR(20),
    code NVARCHAR(6),
    created_at DATETIME,
    expires_at DATETIME,
    active BIT
);

-- Tạo bảng Categories
CREATE TABLE Categories (
    id NVARCHAR(20) NOT NULL,
    name NVARCHAR(50) NOT NULL,
    description NVARCHAR(200)
);

-- Tạo bảng Products
CREATE TABLE Products (
    id NVARCHAR(20) NOT NULL,
    name NVARCHAR(MAX) NOT NULL,
    quantity INT NOT NULL,
    price FLOAT NOT NULL,
    description NVARCHAR(MAX),
    status BIT NOT NULL,
    image1 NVARCHAR(MAX),
    image2 NVARCHAR(MAX),
    category_id NVARCHAR(20) NOT NULL
);

-- Tạo bảng Distinctives
CREATE TABLE Distinctives (
    id NVARCHAR(20) NOT NULL,
    name NVARCHAR(MAX)
);

-- Tạo bảng Products_Distinctives
CREATE TABLE Products_Distinctives (
    id INT IDENTITY(1,1) NOT NULL,
    product_id NVARCHAR(20) NOT NULL,
    distinctive_id NVARCHAR(20) NOT NULL
);

-- Tạo bảng Comments
CREATE TABLE Comments (
    id INT IDENTITY(1,1) NOT NULL,
    content NVARCHAR(MAX),
    like_count INT,
    order_date DATE NOT NULL,
    user_id NVARCHAR(20) NOT NULL,
    product_id NVARCHAR(20) NOT NULL
);

-- Tạo bảng Invoices
CREATE TABLE Invoices (
    id NVARCHAR(20) NOT NULL,
    order_date DATETIME NOT NULL,
    address NVARCHAR(200),
    status NVARCHAR(50) NOT NULL,
    note NVARCHAR(200),
    user_id NVARCHAR(20) NOT NULL
);

-- Tạo bảng Detailed_Invoices
CREATE TABLE Detailed_Invoices (
    id INT IDENTITY(1,1) NOT NULL,
    invoice_id NVARCHAR(20) NOT NULL,
    product_id NVARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    payment_method NVARCHAR(200) NOT NULL
);

-- Tạo bảng Brands
CREATE TABLE Brands (
    id NVARCHAR(20) NOT NULL,
    name NVARCHAR(200) NOT NULL,
    phone_number NVARCHAR(10) NOT NULL,
    email NVARCHAR(100),
    address NVARCHAR(MAX)
);

-- Tạo bảng Suppliers
CREATE TABLE Suppliers (
    id NVARCHAR(20) NOT NULL,
    name NVARCHAR(200) NOT NULL,
    phone_number NVARCHAR(10) NOT NULL,
    email NVARCHAR(100),
    address NVARCHAR(MAX)
);

-- Tạo bảng Stock_Receipts
CREATE TABLE Stock_Receipts (
    id INT IDENTITY(1,1) NOT NULL,
    product_id NVARCHAR(20) NOT NULL,
    supplier_id NVARCHAR(20) NOT NULL,
    brand_id NVARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    price FLOAT NOT NULL,
    order_date DATE NOT NULL
);

-- Tạo bảng User_Histories
CREATE TABLE User_Histories (
    id_history INT IDENTITY(1,1) NOT NULL,
    note NVARCHAR(200),
    history_date DATE NOT NULL,
    history_time NVARCHAR(20) NOT NULL,
    user_id NVARCHAR(20) NOT NULL
);
	--II. Tạo Khóa chính
	-- Thêm khóa chính cho bảng StockReceipts
		ALTER TABLE stock_receipts
	ADD CONSTRAINT PK_DetailedReceipt PRIMARY KEY (id);

	-- Thêm khóa chính cho bảng Users 
		ALTER TABLE Accounts
	ADD CONSTRAINT PK_User PRIMARY KEY (id);

	go
	
	--Thêm khóa chính cho bảng suppliers
	alter table  suppliers add constraint PK_suppliers primary key (id);

	--Thêm khóa chính cho bảng history
	alter table  user_Histories add constraint PK_history primary key (id_history);

	-- Thêm khóa chính cho bảng Categories
	ALTER TABLE Categories
	ADD CONSTRAINT PK_Categories PRIMARY KEY (id);

	go
	-- Thêm khóa chính cho bảng Products
	ALTER TABLE Products
	ADD CONSTRAINT PK_Products PRIMARY KEY (id);

		-- Thêm khóa chính cho bảng comments
	ALTER TABLE comments
	ADD CONSTRAINT PK_Comments PRIMARY KEY (id);

	go
			-- Thêm khóa chính cho bảng distinctives
	ALTER TABLE distinctives
	ADD CONSTRAINT PK_distinctives PRIMARY KEY (id);

	go
				-- Thêm khóa chính cho bảng products_distinctives
	ALTER TABLE  products_distinctives
	ADD CONSTRAINT PK_products_distinctives PRIMARY KEY (id);

	go

	-- Thêm khóa chính cho bảng Invoices
	ALTER TABLE Invoices
	ADD CONSTRAINT PK_Invoices PRIMARY KEY (id);

	go

	-- Thêm khóa chính cho bảng Brands
	ALTER TABLE Brands
	ADD CONSTRAINT PK_Brands PRIMARY KEY (id);

	-- Thêm khóa chính cho bảng carts
	ALTER TABLE Carts
	ADD CONSTRAINT PK_Carts PRIMARY KEY (id);

	-- Thêm khóa chính cho bảng DetailedInvoices
	ALTER TABLE Detailed_invoices
	ADD CONSTRAINT PK_detailed_invoices PRIMARY KEY (id);
	go
		-- Thêm khóa chính cho bảng code
		ALTER TABLE mail_codes
	ADD CONSTRAINT PK_mail_codes PRIMARY KEY (id);
	--III. Tạo khóa ngoại 


	-- Thêm liên kết khóa ngoại cho bảng Products
	ALTER TABLE Products
	ADD CONSTRAINT FK_Product_Categories FOREIGN KEY (category_id) REFERENCES Categories(id)
	go

	-- Thêm liên kết khóa ngoại cho bảng Invoices
	ALTER TABLE Invoices
	ADD CONSTRAINT FK_Invoices_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id);


	go
	-- Thêm liên kết khóa ngoại cho bảng comments
	ALTER TABLE comments
	ADD CONSTRAINT FK_Comments_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id);

		ALTER TABLE comments
	ADD CONSTRAINT FK_Comments_Products FOREIGN KEY (product_id) REFERENCES Products(id);
	go


	-- Thêm liên kết khóa ngoại cho bảng DetailedInvoices
	ALTER TABLE Detailed_invoices
	ADD CONSTRAINT FK_DetailedInvoices_Invoices FOREIGN KEY (invoice_id) REFERENCES Invoices(id)

	ALTER TABLE Detailed_invoices
	ADD CONSTRAINT FK_DetailedInvoices_Products FOREIGN KEY (product_id) REFERENCES Products(id);

	go

	-- Thêm liên kết khóa ngoại cho bảng Carts
	ALTER TABLE Carts
	ADD CONSTRAINT FK_Carts_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id)
 
	ALTER TABLE Carts ADD CONSTRAINT FK_Carts_Products FOREIGN KEY (product_id) REFERENCES Products(id);

	go

	-- Thêm liên kết khóa ngoại cho bảng StockReceipts
ALTER TABLE stock_receipts ADD CONSTRAINT FK_stock_receipts_Products FOREIGN KEY (product_id) REFERENCES Products(id) ;
	ALTER TABLE stock_receipts ADD CONSTRAINT FK_stock_receipts_suppliers FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ;
	ALTER TABLE stock_receipts ADD CONSTRAINT FK_stock_receipts_brands FOREIGN KEY (brand_id) REFERENCES brands(id)   ;
	go

	-- thêm liên kết khóa ngoại cho bảng history
	alter table  user_Histories add constraint FK_user_Histories_Accounts FOREIGN KEY (user_id) REFERENCES Accounts(id)
	

		-- thêm liên kết khóa ngoại cho bảng products_distinctives
	alter table  products_distinctives add constraint FK_products_distinctives_product FOREIGN KEY (product_id) REFERENCES products(id)

	alter table  products_distinctives add constraint FK_products_distinctives_distinctives FOREIGN KEY (distinctive_id) REFERENCES distinctives(id)






ALTER TABLE verification 
ADD CONSTRAINT FK_Verification_Accounts 
FOREIGN KEY (account_id) REFERENCES accounts(id);


