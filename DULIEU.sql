-- Thêm dữ liệu mẫu cho Accounts
INSERT INTO Accounts (id, phone, fullname, email, password, birthday, gender) VALUES
(N'U1', N'0123450001', N'Nguyễn Văn A', N'user1@mail.com', N'pass1', '1990-01-01', 'M'),
(N'U2', N'0123450002', N'Trần Thị B', N'user2@mail.com', N'pass2', '1991-02-02', 'F'),
(N'U3', N'0123450003', N'Lê Văn C', N'user3@mail.com', N'pass3', '1992-03-03', 'M'),
(N'U4', N'0123450004', N'Phạm Thị D', N'user4@mail.com', N'pass4', '1993-04-04', 'F'),
(N'U5', N'0123450005', N'Hoàng Văn E', N'user5@mail.com', N'pass5', '1994-05-05', 'O'),
(N'U6', N'0123450006', N'Nguyễn Thị F', N'user6@mail.com', N'pass6', '1995-06-06', 'M'),
(N'U7', N'0123450007', N'Trần Văn G', N'user7@mail.com', N'pass7', '1996-07-07', 'F'),
(N'U8', N'0123450008', N'Lê Thị H', N'user8@mail.com', N'pass8', '1997-08-08', 'M'),
(N'U9', N'0123450009', N'Phạm Văn I', N'user9@mail.com', N'pass9', '1998-09-09', 'O'),
(N'U10', N'0123450010', N'Hoàng Thị K', N'user10@mail.com', N'pass10', '1999-10-10', 'M');

-- Thêm dữ liệu mẫu cho Roles
INSERT INTO Roles (name, description) VALUES
(N'Admin', N'Quản trị viên'),
(N'User', N'Người dùng thông thường'),
(N'Seller', N'Người bán hàng'),
(N'Customer', N'Khách hàng'),
(N'Manager', N'Quản lý'),
(N'Staff', N'Nhân viên'),
(N'Guest', N'Khách vãng lai'),
(N'VIP', N'Khách hàng VIP'),
(N'Support', N'Hỗ trợ khách hàng'),
(N'Marketing', N'Tiếp thị');

-- Thêm dữ liệu mẫu cho Accounts_Roles
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
(N'Giày thể thao', N'Các loại giày dành cho hoạt động thể thao'),
(N'Áo thể thao', N'Áo dành cho hoạt động thể thao'),
(N'Quần thể thao', N'Quần dành cho hoạt động thể thao'),
(N'Phụ kiện', N'Các phụ kiện thể thao'),
(N'Dụng cụ thể thao', N'Dụng cụ hỗ trợ tập luyện thể thao'),
(N'Balo thể thao', N'Balo và túi xách thể thao'),
(N'Đồng hồ thể thao', N'Đồng hồ dành cho hoạt động thể thao'),
(N'Kính thể thao', N'Kính bảo hộ và kính mát thể thao'),
(N'Nón thể thao', N'Nón và mũ thể thao'),
(N'Vớ thể thao', N'Vớ và tất thể thao');

-- Thêm dữ liệu mẫu cho Products
INSERT INTO Products (name, quantity, price, description, category_id) VALUES
(N'Giày Nike Air Max', 100, 2500000, N'Giày thể thao Nike chính hãng', 1),
(N'Áo Nike Dri-FIT', 150, 850000, N'Áo thể thao công nghệ Dri-FIT', 2),
(N'Quần Adidas Runner', 120, 750000, N'Quần chạy bộ Adidas', 3),
(N'Giày Adidas Ultra Boost', 80, 3200000, N'Giày chạy bộ Adidas', 1),
(N'Áo Puma Sport', 200, 650000, N'Áo thể thao Puma', 2),
(N'Balo thể thao Adidas', 50, 1200000, N'Balo thể thao Adidas', 6),
(N'Đồng hồ Garmin', 30, 5000000, N'Đồng hồ thể thao Garmin', 7),
(N'Kính Oakley', 40, 3000000, N'Kính thể thao Oakley', 8),
(N'Nón Nike', 70, 450000, N'Nón thể thao Nike', 9),
(N'Vớ Adidas', 90, 150000, N'Vớ thể thao Adidas', 10);

-- Thêm dữ liệu mẫu cho Suppliers
INSERT INTO Suppliers (name, phone_number, email, address) VALUES
(N'Công ty TNHH Thể Thao Việt', '0901234570', 'thethao@gmail.com', N'Hà Nội'),
(N'Công ty CP Thể Thao Sài Gòn', '0901234571', 'saigonsport@gmail.com', N'TP.HCM'),
(N'Công ty TNHH Thể Thao Đà Nẵng', '0901234572', 'danangsport@gmail.com', N'Đà Nẵng'),
(N'Công ty TNHH Thể Thao Cần Thơ', '0901234573', 'canthosport@gmail.com', N'Cần Thơ'),
(N'Công ty TNHH Thể Thao Hải Phòng', '0901234574', 'haiphongsport@gmail.com', N'Hải Phòng'),
(N'Công ty TNHH Thể Thao Huế', '0901234575', 'huesport@gmail.com', N'Huế'),
(N'Công ty TNHH Thể Thao Nha Trang', '0901234576', 'nhatrangsport@gmail.com', N'Nha Trang'),
(N'Công ty TNHH Thể Thao Vũng Tàu', '0901234577', 'vungtausport@gmail.com', N'Vũng Tàu'),
(N'Công ty TNHH Thể Thao Bình Dương', '0901234578', 'binhduongsport@gmail.com', N'Bình Dương'),
(N'Công ty TNHH Thể Thao Đồng Nai', '0901234579', 'dongnaisport@gmail.com', N'Đồng Nai');

-- Thêm dữ liệu mẫu cho Brands
INSERT INTO Brands (name, phone_number, email, address) VALUES
('Nike', '0901234580', 'nike@nike.com', 'USA'),
('Adidas', '0901234581', 'adidas@adidas.com', 'Germany'),
('Puma', '0901234582', 'puma@puma.com', 'Germany'),
('Under Armour', '0901234583', 'underarmour@ua.com', 'USA'),
('Reebok', '0901234584', 'reebok@reebok.com', 'USA'),
('New Balance', '0901234585', 'newbalance@nb.com', 'USA'),
('Asics', '0901234586', 'asics@asics.com', 'Japan'),
('Mizuno', '0901234587', 'mizuno@mizuno.com', 'Japan'),
('Converse', '0901234588', 'converse@converse.com', 'USA'),
('Vans', '0901234589', 'vans@vans.com', 'USA');

-- Thêm dữ liệu mẫu cho Stock_Receipts
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
(1, 1, 10, 2500000.00),
(2, 2, 20, 850000.00),
(3, 3, 30, 750000.00),
(4, 4, 40, 3200000.00),
(5, 5, 50, 650000.00),
(6, 6, 60, 1200000.00),
(7, 7, 70, 5000000.00),
(8, 8, 80, 3000000.00),
(9, 9, 90, 450000.00),
(10, 10, 100, 150000.00);

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
(10, N'https://example.com/img10.jpg');

-- Thêm dữ liệu mẫu cho Sizes
INSERT INTO Sizes (name) VALUES 
('S'),
('M'),
('L'),
('XL'),
('XXL'),
('38'),
('39'),
('40'),
('41'),
('42');
GO

-- Thêm dữ liệu mẫu cho Product_Sizes
INSERT INTO Product_Sizes (product_id, size_id, quantity, price) VALUES
(1, 1, 10, 2500000),
(2, 2, 20, 850000),
(3, 3, 30, 750000),
(4, 4, 40, 3200000),
(5, 5, 50, 650000),
(6, 6, 60, 1200000),
(7, 7, 70, 5000000),
(8, 8, 80, 3000000),
(9, 9, 90, 450000),
(10, 10, 100, 150000);

-- Thêm dữ liệu mẫu cho Comments
INSERT INTO Comments (content, user_id, product_id) VALUES
(N'Sản phẩm rất tốt', N'U1', 1),
(N'Chất lượng cao', N'U2', 2),
(N'Đáng mua', N'U3', 3),
(N'Giá hợp lý', N'U4', 4),
(N'Tuyệt vời', N'U5', 5),
(N'Rất hài lòng', N'U6', 6),
(N'Sản phẩm đẹp', N'U7', 7),
(N'Chất lượng tốt', N'U8', 8),
(N'Giá cả phải chăng', N'U9', 9),
(N'Sẽ mua lại', N'U10', 10);

-- Thêm dữ liệu mẫu cho CancelReasons
INSERT INTO cancel_reasons (reason) VALUES
(N'Đổi ý không muốn mua'),
(N'Đặt nhầm sản phẩm'),
(N'Không hài lòng về chất lượng'),
(N'Giá quá cao'),
(N'Không cần thiết nữa'),
(N'Phát hiện lỗi sản phẩm'),
(N'Không đúng mô tả'),
(N'Giao hàng chậm'),
(N'Không liên lạc được với người bán'),
(N'Lý do khác');

-- Thêm dữ liệu mẫu cho Invoices
INSERT INTO Invoices (address, user_id) VALUES
(N'123 Đường ABC, Quận 1, TP.HCM', N'U1'),
(N'456 Đường DEF, Quận 2, TP.HCM', N'U2'),
(N'789 Đường GHI, Quận 3, TP.HCM', N'U3'),
(N'101 Đường JKL, Quận 4, TP.HCM', N'U4'),
(N'112 Đường MNO, Quận 5, TP.HCM', N'U5'),
(N'131 Đường PQR, Quận 6, TP.HCM', N'U6'),
(N'415 Đường STU, Quận 7, TP.HCM', N'U7'),
(N'161 Đường VWX, Quận 8, TP.HCM', N'U8'),
(N'718 Đường YZ, Quận 9, TP.HCM', N'U9'),
(N'192 Đường ABC, Quận 10, TP.HCM', N'U10');


-- Thêm dữ liệu mẫu cho Detailed_Invoices
INSERT INTO Detailed_Invoices (invoice_id, product_id, size_id, quantity, unit_price, payment_method) VALUES
(11, 1, 1, 2, 2500000.00 ,N'Tiền mặt'),
(2, 2, 2, 2, 850000.00 ,N'Thẻ tín dụng'),
(3, 3, 3, 3, 750000.00 ,N'Tiền mặt'),
(4, 4, 4, 4, 3200000.00 ,N'Thẻ tín dụng'),
(5, 5, 5, 5, 650000.00 ,N'Tiền mặt'),
(6, 6, 6, 6, 1200000.00 ,N'Thẻ tín dụng'),
(7, 7, 7, 7, 5000000.00 ,N'Tiền mặt'),
(8, 8, 8, 8, 3000000.00 ,N'Thẻ tín dụng'),
(9, 9, 9, 9, 450000.00 ,N'Tiền mặt'),
(10, 10, 10, 10, 150000.00 ,N'Thẻ tín dụng');
GO



-- Thêm dữ liệu mẫu cho Product_Attributes
INSERT INTO Product_Attributes (name) VALUES
(N'Chống nước'),
(N'Chống trượt'),
(N'Chống sốc'),
(N'Chống tia UV'),
(N'Chống bám bụi'),
(N'Chống mài mòn'),
(N'Chống thấm'),
(N'Chống nhiệt'),
(N'Chống tĩnh điện'),
(N'Chống cháy');

-- Thêm dữ liệu mẫu cho Product_Attribute_Mappings
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
(10, 10);

-- Thêm dữ liệu mẫu cho User_Histories
INSERT INTO User_Histories (note, user_id) VALUES
(N'Mua hàng lần đầu', N'U1'),
(N'Thêm sản phẩm vào giỏ hàng', N'U2'),
(N'Đặt hàng thành công', N'U3'),
(N'Hủy đơn hàng', N'U4'),
(N'Đổi trả sản phẩm', N'U5'),
(N'Nhận hàng thành công', N'U6'),
(N'Viết đánh giá sản phẩm', N'U7'),
(N'Liên hệ hỗ trợ', N'U8'),
(N'Thêm địa chỉ mới', N'U9'),
(N'Cập nhật thông tin cá nhân', N'U10');