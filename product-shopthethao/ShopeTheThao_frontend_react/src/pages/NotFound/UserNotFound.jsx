import React from 'react';
import { Button, Result, Space } from 'antd';
import { Link } from 'react-router-dom';

const UserNotFound = () => (
    <Result
        status="403"
        title={<h2>Không có quyền truy cập</h2>}
        subTitle={
            <>
                <h3>Xin lỗi, bạn không có quyền truy cập trang này.</h3>
                <h3>Vui lòng quay lại trang chủ hoặc đăng nhập với tài khoản khác!</h3>
            </>
        }
        extra={
            <Space>
                <Link to="/">
                    <Button type="primary">Về trang chủ</Button>
                </Link>
                <Link to="/login">
                    <Button onClick={() => localStorage.clear()}>Đăng nhập lại</Button>
                </Link>
            </Space>
        }
    />
);

export default UserNotFound;
