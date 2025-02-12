import React from "react";
import { Modal, Form, Input } from "antd";
import {
  TagOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import styles from "pages/Admin/modalStyles.module.scss"; // Giả sử có file css cho modal

const BrandsModal = ({
  open,
  setOpen,
  editBrand,
  form,
  handleModalOk,
  handleModalCancel,
}) => {
  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          {editBrand ? "✏️ Cập nhật Thương hiệu" : "➕ Thêm Thương hiệu mới"}
        </div>
      }
      open={open}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      centered
      className={styles.modalWidth}
    >
      <Form form={form} layout="vertical">
        {/* Tên Thương hiệu */}
        <Form.Item
          name="name"
          label="Tên Thương hiệu"
          rules={[
            { required: true, message: "Vui lòng nhập tên Thương hiệu!" },
          ]}
        >
          <Input prefix={<TagOutlined />} placeholder="Nhập tên Thương hiệu" />
        </Form.Item>

        {/* Số điện thoại */}
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập Số điện thoại!" }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Nhập email" />
        </Form.Item>

        {/* Địa chỉ */}
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng nhập Địa chỉ!" }]}
        >
          <Input prefix={<HomeOutlined />} placeholder="Nhập địa chỉ" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BrandsModal;