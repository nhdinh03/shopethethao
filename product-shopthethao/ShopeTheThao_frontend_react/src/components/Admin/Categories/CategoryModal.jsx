import React from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import { FolderOpenOutlined, FileTextOutlined, RedoOutlined, SaveOutlined } from "@ant-design/icons";
import "pages/Admin/Categories/Categories.scss"

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
      title={
        <span>
          {editingCategory ? "✏️ Cập nhật danh mục" : "➕ Thêm danh mục mới"}
        </span>
      }
      open={open}
      footer={null}
      onCancel={handleCancel}
      width={520}
      className="custom-modal"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
        >
          <Input
            prefix={<FolderOpenOutlined />}
            placeholder="Nhập tên danh mục"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả danh mục"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea
            prefix={<FileTextOutlined />}
            placeholder="Nhập mô tả chi tiết cho danh mục"
            rows={4}
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </Form.Item>

        <div className="modal-footer">
          {!editingCategory && (
            <Button
              icon={<RedoOutlined />}
              onClick={handleResetForm}
              className="reset-button"
            >
              Làm mới
            </Button>
          )}
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleModalOk}
            className="submit-button"
          >
            {editingCategory ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
