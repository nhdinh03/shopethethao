import React from 'react';
import { Row, Tag } from 'antd';

const AccountInfoCard = ({ account }) => {
  const maskPhone = (phone) => phone?.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2") || "";
  const maskEmail = (email) => email?.replace(/(^.{2})(.*?)(@.*)/, "$1****$3") || "";
  const maskAddress = (address) => address?.replace(/(.{5})(.*)/, "$1*****") || "";

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <div>
          <strong>Tên: </strong>{account.fullname} <br />
          <strong>Số điện thoại: </strong>{maskPhone(account.phone)} <br />
          <strong>Email: </strong>{maskEmail(account.email)} <br />
          <strong>Địa chỉ: </strong>{maskAddress(account.address)} <br />
          <strong>Ngày sinh: </strong>{new Date(account.birthday).toLocaleDateString()} <br />
          <strong>Điểm: </strong>{account.points} <br />
          <strong>Xác thực: </strong>
          <Tag color={account.verified ? "blue" : "orange"}>
            {account.verified ? "Đã xác thực Tài khoản" : "Chưa xác thực Tài khoản"}
          </Tag>
        </div>
      </Row>
    </div>
  );
};

export default AccountInfoCard;
