INSERT INTO Roles (name, description) VALUES 
(N'Admin', N'Quản trị viên hệ thống'),
(N'Customer', N'Khách hàng mua sản phẩm'),
(N'Seller', N'Người bán hàng'),
(N'Staff', N'Nhân viên quản lý kho'),
(N'Marketing', N'Nhân viên tiếp thị và quảng bá');

INSERT INTO Accounts (id, phone, fullname, image, email, address, password, birthday, gender, status, verified, created_date, points) VALUES 
(N'U001', N'0987654321', N'Nguyễn Văn A', NULL, N'nguyenvana@example.com', N'123 Đường ABC, TP.HCM', N'hashed_password1', '1990-05-15', 1, 1, 1, GETDATE(), 100),
(N'U002', N'0977123456', N'Trần Thị B', NULL, N'tranthib@example.com', N'456 Đường XYZ, Hà Nội', N'hashed_password2', '1985-08-22', 0, 1, 1, GETDATE(), 200),
(N'U003', N'0966789123', N'Lê Văn C', NULL, N'levanc@example.com', N'789 Đường DEF, Đà Nẵng', N'hashed_password3', '1995-07-30', 1, 1, 1, GETDATE(), 150),
(N'U004', N'0952345678', N'Phạm Thị D', NULL, N'phamthid@example.com', N'321 Đường GHI, Hải Phòng', N'hashed_password4', '2000-12-10', 0, 1, 1, GETDATE(), 180),
(N'U005', N'0941234567', N'Đỗ Minh E', NULL, N'dohmine@example.com', N'654 Đường JKL, Cần Thơ', N'hashed_password5', '1992-03-25', 1, 1, 1, GETDATE(), 250);

INSERT INTO Accounts_Roles (account_id, role_id) VALUES 
(N'U001', 1),
(N'U002', 2),
(N'U003', 3),
(N'U004', 4),
(N'U005', 5);

INSERT INTO Categories (name, description) VALUES 
(N'Giày thể thao', N'Các loại giày thể thao chuyên dụng'),
(N'Quần áo thể thao', N'Các loại quần áo dành cho thể thao'),
(N'Dụng cụ thể thao', N'Dụng cụ tập luyện thể thao'),
(N'Phụ kiện thể thao', N'Các loại phụ kiện hỗ trợ thể thao'),
(N'Thiết bị điện tử thể thao', N'Thiết bị thông minh hỗ trợ thể thao');

INSERT INTO Products (name, quantity, price, description, status, image1, image2, category_id) VALUES 
(N'Giày chạy bộ Nike Air Zoom', 50, 2500000, N'Giày chạy bộ chuyên nghiệp Nike Air Zoom', 1, NULL, NULL, 1),
(N'Áo thể thao Adidas', 100, 800000, N'Áo thể thao thoáng khí Adidas', 1, NULL, NULL, 2),
(N'Dây nhảy thể dục', 200, 150000, N'Dây nhảy thể dục cao cấp', 1, NULL, NULL, 3),
(N'Balo thể thao Puma', 75, 1200000, N'Balo thể thao đa năng Puma', 1, NULL, NULL, 4),
(N'Đồng hồ Garmin Forerunner', 30, 6000000, N'Đồng hồ thông minh hỗ trợ thể thao Garmin', 1, NULL, NULL, 5);
GO



-- Thêm các kích cỡ vào bảng Sizes
INSERT INTO Sizes (name) VALUES
    ('S'),
    ('M'),
    ('L'),
    ('XL'),
    ('XXL');
GO



-- Thêm dữ liệu vào bảng Product_Sizes với khóa ngoại size_id
INSERT INTO Product_Sizes (product_id, size_id, quantity, price)
VALUES
    (1, (SELECT id FROM Sizes WHERE name = 'S'), 10, 100.00),  -- Giá 100 cho size S
    (1, (SELECT id FROM Sizes WHERE name = 'M'), 15, 120.00),  -- Giá 120 cho size M
    (1, (SELECT id FROM Sizes WHERE name = 'L'), 12, 130.00),  -- Giá 130 cho size L
    (1, (SELECT id FROM Sizes WHERE name = 'XL'), 8, 140.00);  -- Giá 140 cho size XL
GO



INSERT INTO Brands (name, phone_number, email, address) VALUES 
(N'Nike', N'0912345678', N'contact@nike.com', N'USA'),
(N'Adidas', N'0923456789', N'contact@adidas.com', N'Germany'),
(N'Puma', N'0934567890', N'contact@puma.com', N'Germany'),
(N'Under Armour', N'0945678901', N'contact@underarmour.com', N'USA'),
(N'Garmin', N'0956789012', N'contact@garmin.com', N'USA');

INSERT INTO Suppliers (name, phone_number, email, address) VALUES 
(N'Công ty TNHH ABC', N'0934567890', N'abc@suppliers.com', N'HCM, Việt Nam'),
(N'Công ty TNHH XYZ', N'0945678901', N'xyz@suppliers.com', N'Hà Nội, Việt Nam'),
(N'Công ty TNHH 123', N'0956789012', N'123@suppliers.com', N'Đà Nẵng, Việt Nam'),
(N'Công ty TNHH SportPro', N'0967890123', N'sportpro@suppliers.com', N'Hải Phòng, Việt Nam'),
(N'Công ty TNHH FitGear', N'0978901234', N'fitgear@suppliers.com', N'Cần Thơ, Việt Nam');

INSERT INTO Stock_Receipts (product_id, supplier_id, brand_id, quantity, price, order_date) VALUES 
(1, 1, 1, 100, 2200000, GETDATE()),
(2, 2, 2, 200, 750000, GETDATE()),
(3, 3, 3, 150, 140000, GETDATE()),
(4, 4, 4, 120, 1100000, GETDATE()),
(5, 5, 5, 50, 5800000, GETDATE());

INSERT INTO Distinctives (name) VALUES 
(N'Chống nước'),
(N'Bền bỉ'),
(N'Nhẹ và thoáng khí'),
(N'Hấp thụ sốc tốt'),
(N'Công nghệ mới nhất');

INSERT INTO Invoices (order_date, address, status, note, user_id) VALUES 
(GETDATE(), N'789 Đường DEF, TP.HCM', N'Pending', N'Giao hàng nhanh', N'U001'),
(GETDATE(), N'101 Đường GHI, Hà Nội', N'Completed', N'Thanh toán qua ví điện tử', N'U002'),
(GETDATE(), N'222 Đường ABC, Đà Nẵng', N'Shipped', N'Miễn phí vận chuyển', N'U003'),
(GETDATE(), N'333 Đường XYZ, Hải Phòng', N'Processing', N'Đặt trước sản phẩm', N'U004'),
(GETDATE(), N'444 Đường MNP, Cần Thơ', N'Cancelled', N'Khách hủy đơn', N'U005');


INSERT INTO Products_Distinctives (product_id, distinctive_id) VALUES 
(1, 1),
(1, 2),
(2, 3),
(3, 2),
(4, 5);

INSERT INTO Detailed_Invoices (invoice_id, product_id, quantity, payment_method) VALUES 
(1, 1, 1, N'Chuyển khoản ngân hàng'),
(2, 2, 2, N'Thanh toán khi nhận hàng'),
(3, 3, 3, N'Ví điện tử Momo'),
(4, 4, 1, N'Thẻ tín dụng'),
(5, 5, 1, N'Tiền mặt');

INSERT INTO Comments (content, like_count, order_date, user_id, product_id) VALUES 
(N'Giày chạy rất êm, đáng mua!', 10, GETDATE(), N'U001', 1),
(N'Áo thể thao đẹp, chất lượng tốt.', 5, GETDATE(), N'U002', 2),
(N'Dây nhảy rất bền, sợi chắc chắn.', 3, GETDATE(), N'U003', 3),
(N'Balo rất rộng, đựng được nhiều đồ.', 4, GETDATE(), N'U004', 4),
(N'Đồng hồ Garmin cực kỳ chính xác!', 8, GETDATE(), N'U005', 5);

INSERT INTO Verification (account_id, code, created_at, expires_at, active) VALUES 
(N'U001', N'123456', GETDATE(), DATEADD(HOUR, 2, GETDATE()), 1),
(N'U002', N'654321', GETDATE(), DATEADD(HOUR, 2, GETDATE()), 1),
(N'U003', N'987654', GETDATE(), DATEADD(HOUR, 2, GETDATE()), 1),
(N'U004', N'135790', GETDATE(), DATEADD(HOUR, 2, GETDATE()), 1),
(N'U005', N'246802', GETDATE(), DATEADD(HOUR, 2, GETDATE()), 1);

INSERT INTO User_Histories (note, history_date, history_time, user_id) VALUES 
(N'Đặt hàng thành công', GETDATE(), N'14:00', N'U001'),
(N'Đã nhận hàng', GETDATE(), N'15:30', N'U002'),
(N'Hủy đơn hàng', GETDATE(), N'16:00', N'U003'),
(N'Thêm sản phẩm vào giỏ hàng', GETDATE(), N'17:45', N'U004'),
(N'Đánh giá sản phẩm', GETDATE(), N'18:20', N'U005');


