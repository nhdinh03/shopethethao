import React from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import { CheckOutlined, RedoOutlined } from "@ant-design/icons";

const SizeModal = ({
  form,
  open,
  handleModalOk,
  handleResetForm,
  handleCancel,
  editSize,
}) => {
  return (
    <Modal
      title={editSize ? "Cập nhật kích thước" : "Thêm kích thước mới"}
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
          <Input placeholder="Nhập tên kích thước" />
        </Form.Item>
        <Space
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          {!editSize && (
            <Button icon={<RedoOutlined />} onClick={handleResetForm}>
              Làm mới
            </Button>
          )}
          <Button
            icon={<CheckOutlined />}
            type="primary"
            onClick={handleModalOk}
          >
            {editSize ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default SizeModal;
