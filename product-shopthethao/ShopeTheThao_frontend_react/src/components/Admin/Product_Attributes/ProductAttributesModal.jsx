import React from "react";
import { Modal, Form, Input, Space, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

const ProductAttributesModal = ({
  open,
  form,
  handleModalOk,
  handleCancel,
  editProductAttributes,
  handleResetForm,
}) => {
  return (
    <Modal
      title={editProductAttributes ? "Cập nhật kích thước" : "Thêm kích thước mới"}
      open={open}
      footer={null}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên kích thước"
          rules={[{ required: true, message: "Vui lòng nhập tên kích thước!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nhập tên kích thước" />
        </Form.Item>
        <Space
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          {!editProductAttributes && <Button onClick={handleResetForm}>Làm mới</Button>}
          <Button type="primary" onClick={handleModalOk}>
            {editProductAttributes ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default ProductAttributesModal;
