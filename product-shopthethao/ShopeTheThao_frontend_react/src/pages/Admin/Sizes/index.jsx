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
  const [searchText, setSearchText] = useState("");

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

  const handleSearch = (value) => {
    setSearchText(value);
    console.log("Searching for:", value);
  };

  // Filter sizes based on search text
  const filteredSizes = size.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="size-page">
      <div className="content-wrapper">
        <h2 className="page-title">Quản lý kích thước sản phẩm</h2>

        <Row gutter={[16, 16]} className="header-actions">
          <Col xs={24} sm={14} md={16} lg={18}>
            <Input
              placeholder="Tìm kiếm kích thước sản phẩm..."
              prefix={<SearchOutlined />}
              className="search-input"
              onChange={(e) => handleSearch(e.target.value)}
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
          handleCancel={() => setOpen(false)}
          editSize={editSize}
        />

        <SizeTable
          sizeData={filteredSizes}
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
    </div>
  );
};

export default Sizes;
