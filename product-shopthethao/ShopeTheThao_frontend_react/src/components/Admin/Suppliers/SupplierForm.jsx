import React from 'react';
import { Form, Input } from 'antd';
import {
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

const SupplierForm = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="Tên Thương hiệu"
        rules={[{ required: true, message: "Vui lòng nhập tên Thương hiệu!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Nhập tên Thương hiệu" />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Số điện thoại"
        rules={[{ required: true, message: "Vui lòng nhập Số điện thoại!" }]}
      >
        <Input prefix={<PhoneOutlined />} placeholder="Vui lòng nhập Số điện thoại" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Vui lòng nhập email!" }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Nhập email" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[{ required: true, message: "Vui lòng nhập Địa chỉ!" }]}
      >
        <Input prefix={<HomeOutlined />} placeholder="Nhập địa chỉ" />
      </Form.Item>
    </Form>
  );
};

export default SupplierForm;
