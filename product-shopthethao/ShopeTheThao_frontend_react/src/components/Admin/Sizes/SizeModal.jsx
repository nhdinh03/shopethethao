import React from "react";
import { Modal, Form, Input, Button } from "antd";
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
      title={
        <span>
          {editSize ? "✏️ Cập nhật kích thước" : "➕ Thêm kích thước mới"}
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
          label="Tên kích thước"
          rules={[
            { required: true, message: "Vui lòng nhập tên kích thước!" },
            { min: 1, max: 10, message: "Tên kích thước từ 1-10 ký tự!" }
          ]}
        >
          <Input placeholder="Ví dụ: S, M, L, XL, XXL" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[
            { max: 100, message: "Mô tả không được quá 100 ký tự!" }
          ]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả cho kích thước (không bắt buộc)"
            rows={4}
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </Form.Item>

        <div className="modal-footer">
          {!editSize && (
            <Button
              icon={<RedoOutlined />}
              onClick={handleResetForm}
              className="reset-button"
            >
              Làm mới
            </Button>
          )}
          <Button
            icon={<CheckOutlined />}
            type="primary"
            onClick={handleModalOk}
            className="submit-button"
          >
            {editSize ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default SizeModal;
