import React, { useState } from "react";
import { Button, Form, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSizeManagement } from "hooks/useSizeManagement";
import "./size.scss";
import { SizeModal, SizePagination, SizeTable } from "components/Admin";

const Sizes = () => {
  const [open, setOpen] = useState(false);
  const [editSize, setEditSize] = useState(null);
  const [form] = Form.useForm();

  const {
    size,
    loading,
    totalPages,
    currentPage,
    pageSize,
    setCurrentPage,
    handlePageSizeChange,
    createSize,
    updateSize,
    deleteSize
  } = useSizeManagement();

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const success = editSize 
        ? await updateSize(editSize.id, values)
        : await createSize(values);
      
      if (success) {
        setOpen(false);
        form.resetFields();
        setEditSize(null);
      }
    } catch (error) {
      // Form validation error will be handled by antd
    }
  };

  const handleEditData = (category) => {
    setEditSize(category);
    form.setFieldsValue(category);
    setOpen(true);
  };

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Quản lý kích thước sản phẩm</h2>
        <div className="header-container">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
            className="add-btn"
          >
            Thêm kích thước
          </Button>
        </div>
      </Row>

      <SizeModal
        form={form}
        open={open}
        handleModalOk={handleModalOk}
        handleResetForm={() => form.resetFields()}
        handleCancel={() => setOpen(false)}
        editSize={editSize}
      />

      <SizeTable
        sizeData={size}
        handleEditData={handleEditData}
        handleDelete={deleteSize}
        loading={loading}
      />

      <SizePagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default Sizes;
