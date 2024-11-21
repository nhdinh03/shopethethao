-- Nhập Liệu


--1. Thêm dữ liệu vào bảng Accounts

INSERT INTO Accounts (id, phone, fullname, [image], email, [address], [password], birthday, gender, [status], verified, created_date, points)
VALUES 
('U001', '0987654321', N'Nguyễn Văn A', 'user1.png', 'user1@gmail.com', N'Hà Nội', 'pass123', '1990-01-01', 1, 1, 1, GETDATE(), 100),
('U002', '0978543210', N'Lê Thị B', 'user2.png', 'user2@gmail.com', N'Sài Gòn', 'pass456', '1992-02-02', 0, 1, 1, GETDATE(), 150),
('U003', '0369876543', N'Trần Văn C', 'user3.png', 'user3@gmail.com', N'Đà Nẵng', 'pass789', '1993-03-03', 1, 1, 0, GETDATE(), 120),
('U004', '0857623476', N'Hoàng Thị D', 'user4.png', 'user4@gmail.com', N'Hải Phòng', 'pass012', '1995-04-04', 0, 0, 1, GETDATE(), 80),
('U005', '0947362846', N'Nguyễn Hữu E', 'user5.png', 'user5@gmail.com', N'Bình Dương', 'pass999', '1998-05-05', 1, 1, 1, GETDATE(), 50);

--2. Thêm dữ liệu vào bảng Roles

INSERT INTO Roles ([name], [description])
VALUES 
(N'Admin', N'Quản trị viên hệ thống'),
(N'User', N'Khách hàng thông thường'),
(N'Staff', N'Nhân viên bán hàng'),
(N'Moderator', N'Kiểm duyệt viên nội dung');
--3. Thêm dữ liệu vào bảng Accounts_Roles

INSERT INTO Accounts_Roles (account_id, role_id)
VALUES 
('U001', 1), -- Admin
('U002', 2), -- User
('U003', 2), -- User
('U004', 3), -- Staff
('U005', 2); -- User
--4. Thêm dữ liệu vào bảng Verification

INSERT INTO Verification (account_id, code, created_at, expires_at, active)
VALUES 
('U001', '123456', GETDATE(), DATEADD(HOUR, 2, GETDATE()), 1),
('U002', '654321', GETDATE(), DATEADD(HOUR, 1, GETDATE()), 0),
('U003', '987654', GETDATE(), DATEADD(HOUR, 3, GETDATE()), 1),
('U004', '456789', GETDATE(), DATEADD(HOUR, 4, GETDATE()), 0),
('U005', '111222', GETDATE(), DATEADD(HOUR, 5, GETDATE()), 1);
--5. Thêm dữ liệu vào bảng Categories

INSERT INTO Categories (id, name, description)
VALUES 
('C001', N'Giày đá bóng', N'Các loại giày chuyên dụng cho bóng đá'),
('C002', N'Quần áo thi đấu', N'Quần áo dành cho cầu thủ và cổ động viên'),
('C003', N'Phụ kiện', N'Băng quấn, găng tay, mũ bảo hộ, và các sản phẩm hỗ trợ khác'),
('C004', N'Bóng', N'Nhiều loại bóng đạt tiêu chuẩn thi đấu');
--6. Thêm dữ liệu vào bảng Products

INSERT INTO Products (id, name, quantity, price, description, status, image1, image2, category_id)
VALUES 
('P001', N'Giày đá bóng Adidas X Speedflow', 50, 1800000, N'Giày chuyên dụng cho tốc độ vượt trội', 1, 'adidas1.png', 'adidas2.png', 'C001'),
('P002', N'Quần áo CLB Real Madrid', 100, 700000, N'Bộ quần áo thi đấu chính thức mùa 2023', 1, 'realmadrid1.png', 'realmadrid2.png', 'C002'),
('P003', N'Găng tay thủ môn Nike GK Vapor Grip', 30, 900000, N'Thiết kế chắc chắn và bám bóng tốt', 1, 'nike1.png', 'nike2.png', 'C003'),
('P004', N'Bóng thi đấu FIFA', 20, 1500000, N'Bóng đạt tiêu chuẩn thi đấu quốc tế', 1, 'fifa1.png', 'fifa2.png', 'C004'),
('P005', N'Băng quấn bảo vệ đầu gối', 70, 200000, N'Hỗ trợ bảo vệ khớp gối khi vận động', 1, 'knee1.png', 'knee2.png', 'C003');
--7. Thêm dữ liệu vào bảng Brands

INSERT INTO Brands (id, name, phone_number, email, address)
VALUES 
('B001', N'Adidas', '0912345678', 'adidas@shop.com', N'Hà Nội'),
('B002', N'Nike', '0987654321', 'nike@shop.com', N'Sài Gòn'),
('B003', N'Puma', '0934567890', 'puma@shop.com', N'Đà Nẵng');
--8. Thêm dữ liệu vào bảng Suppliers

INSERT INTO Suppliers (id, name, phone_number, email, address)
VALUES 
('S001', N'FIFA Store', '0123456789', 'fifa@suppliers.com', N'Hà Nội'),
('S002', N'SportMart', '0987654321', 'sportmart@suppliers.com', N'Sài Gòn');
--9. Thêm dữ liệu vào bảng Stock_Receipts

INSERT INTO Stock_Receipts (product_id, supplier_id, brand_id, quantity, price, order_date)
VALUES 
('P001', 'S001', 'B001', 50, 1800000, '2023-10-01'),
('P002', 'S002', 'B002', 100, 700000, '2023-10-02'),
('P003', 'S001', 'B003', 30, 900000, '2023-10-03');
--10. Thêm dữ liệu vào bảng Comments

INSERT INTO Comments (content, like_count, order_date, user_id, product_id)
VALUES 
(N'Sản phẩm rất tốt', 10, '2023-10-01', 'U001', 'P001'),
(N'Giá hơi cao nhưng đáng tiền', 5, '2023-10-02', 'U002', 'P002'),
(N'Bám bóng tốt, rất hài lòng', 15, '2023-10-03', 'U003', 'P003');
--11. Thêm dữ liệu vào bảng Invoices

INSERT INTO Invoices (id, order_date, address, status, note, user_id)
VALUES 
('I001', '2023-10-01', N'Hà Nội', N'Giao hàng thành công', N'Thanh toán bằng tiền mặt', 'U001'),
('I002', '2023-10-02', N'Sài Gòn', N'Đang giao hàng', N'Thanh toán bằng thẻ', 'U002');
--12. Thêm dữ liệu vào bảng Detailed_Invoices

INSERT INTO Detailed_Invoices (invoice_id, product_id, quantity, payment_method)
VALUES 
('I001', 'P001', 2, N'Thanh toán bằng tiền mặt'),
('I002', 'P002', 1, N'Thanh toán bằng thẻ');
--13. Thêm dữ liệu vào bảng Distinctives

INSERT INTO Distinctives (id, name)
VALUES 
('D001', N'Chống nước'),
('D002', N'Chống trơn trượt');
--14. Thêm dữ liệu vào bảng Products_Distinctives

INSERT INTO Products_Distinctives (product_id, distinctive_id)
VALUES 
('P001', 'D001'),
('P003', 'D002');
--15. Thêm dữ liệu vào bảng User_Histories

INSERT INTO User_Histories (note, history_date, history_time, user_id)
VALUES 
(N'Đặt hàng thành công', '2023-10-01', '10:30', 'U001'),
(N'Hủy đơn hàng', '2023-10-02', '15:45', 'U002'),
(N'Hoàn tất thanh toán', '2023-10-03', '09:20', 'U003'),
(N'Nhận hàng', '2023-10-04', '18:30', 'U004'),
(N'Tạo tài khoản', '2023-10-05', '11:15', 'U005'),
(N'Đổi sản phẩm', '2023-10-06', '14:50', 'U001'),
(N'Thanh toán thất bại', '2023-10-07', '08:40', 'U002'),
(N'Thêm sản phẩm vào giỏ', '2023-10-08', '19:25', 'U003'),
(N'Xóa sản phẩm khỏi giỏ', '2023-10-09', '16:10', 'U004'),
(N'Hoàn tiền', '2023-10-10', '10:00', 'U005');


