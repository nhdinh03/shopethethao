import React, { useState } from "react";
import { Button, Form, Row, Col, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
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
    deleteSize,
    searchText,
    handleSearch
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
    <div className="size-page">
      <div className="content-wrapper">
        <h2 className="page-title">Quản lý kích thước sản phẩm</h2>

        <Row gutter={[16, 16]} className="header-actions">
          <Col xs={24} sm={14} md={16} lg={18}>
            <Input
              placeholder="Tìm kiếm theo ID, tên, mô tả..."
              prefix={<SearchOutlined />}
              className="search-input"
              onChange={(e) => handleSearch(e.target.value)}
              value={searchText}
              allowClear
            />
          </Col>
          <Col xs={24} sm={10} md={8} lg={6} className="add-button-container">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpen(true)}
              className="add-btn"
            >
              Thêm kích thước
            </Button>
          </Col>
        </Row>

        <SizeModal
          form={form}
          open={open}
          handleModalOk={handleModalOk}
          handleResetForm={() => form.resetFields()}
          handleCancel={() => {
            setOpen(false);
            form.resetFields();
            setEditSize(null);
          }}
          editSize={editSize}
        />

        <div className="table-container">
          <SizeTable
            sizeData={size} // Use the API filtered data directly
            handleEditData={handleEditData}
            handleDelete={deleteSize}
            loading={loading}
          />
        </div>

        <div className="pagination-container">
          <SizePagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            handlePageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Sizes;
