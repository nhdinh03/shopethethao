import React from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import { FolderOpenOutlined, FileTextOutlined, RedoOutlined, SaveOutlined } from "@ant-design/icons";

const CategoryModal = ({
  open,
  setOpen,
  form,
  handleModalOk,
  handleResetForm,
  editingCategory,
}) => {
  const handleCancel = () => {
    setOpen(false);
    handleResetForm();
  };

  return (
    <Modal
      title={editingCategory ? "✏️ Cập nhật danh mục" : "➕ Thêm danh mục mới"}
      open={open}
      footer={null}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        {/* Tên danh mục */}
        <Form.Item
          name="name"
          label="📂 Tên danh mục"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
        >
          <Input
            prefix={<FolderOpenOutlined />}
            placeholder="Nhập tên danh mục"
          />
        </Form.Item>

        {/* Mô tả danh mục */}
        <Form.Item
          name="description"
          label="📝 Mô tả danh mục"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input prefix={<FileTextOutlined />} placeholder="Nhập mô tả" />
        </Form.Item>

        {/* Nút hành động */}
        <Space
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          {!editingCategory && (
            <Button icon={<RedoOutlined />} onClick={handleResetForm}>
              Làm mới
            </Button>
          )}
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleModalOk}
          >
            {editingCategory ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
