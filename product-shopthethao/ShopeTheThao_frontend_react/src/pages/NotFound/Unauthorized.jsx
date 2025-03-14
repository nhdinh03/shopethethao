import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
const Unauthorized = () => (
    <Result
        status="404"
        title={<h2>Rất tiếc...</h2>}
        subTitle={
            <>
            <h3>Xin lỗi bạn không có quyền truy cập trang này.</h3>
            <h3>Vui lòng quay lại sau!.</h3>
          </>
        }
        extra={
            <Link to={'/v1/auth/login'} type="">
                <Button>Về Đăng nhập</Button>
            </Link>
        }
    />
);
export default Unauthorized;
