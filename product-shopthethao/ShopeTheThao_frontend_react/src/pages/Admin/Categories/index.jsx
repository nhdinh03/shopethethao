import React, { useState } from "react";
import { Button, Form, Row, message, Input, Col } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "..//index.scss";
import {
  CategoryTable,
  CategoryPagination,
  CategoryModal,
} from "components/Admin";
import useCategories from "hooks/useCategories";

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();


  const {
    categories,
    loading,
    currentPage,
    pageSize,
    totalPages,
    searchText,
    createCategory,
    updateCategory,
    deleteCategory,
    handlePageSizeChange,
    setCurrentPage,
    handleSearch,
  } = useCategories();

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const isDuplicate = categories.some(
        (category) =>
          category.name.trim().toLowerCase() === values.name.trim().toLowerCase() &&
          (!editingCategory || category.id !== editingCategory.id)
      );
      
      if (isDuplicate) {
        message.error("Tên danh mục đã tồn tại, vui lòng chọn tên khác!");
        return;
      }

      let success;
      if (editingCategory) {
        success = await updateCategory(editingCategory.id, values);
      } else {
        success = await createCategory(values);
      }

      if (success) {
        setOpen(false);
        form.resetFields();
        setEditingCategory(null);
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleEditData = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setOpen(true);
  };

  // Filter categories using optional chaining
  const filteredCategories = categories.filter(item => 
    item?.name?.toLowerCase().includes((searchText || '').toLowerCase())
  );

  return (
    <div className="categories-page">
      <div className="content-wrapper">
        <h2 className="page-title">Quản lý danh mục</h2>

        <Row gutter={[16, 16]} className="header-actions">
          <Col xs={24} sm={14} md={16} lg={18}>
            <Input
              placeholder="Tìm kiếm danh mục theo tên..."
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
              Thêm danh mục
            </Button>
          </Col>
        </Row>

        <CategoryModal
          open={open}
          setOpen={setOpen}
          form={form}
          handleModalOk={handleModalOk}
          handleResetForm={() => form.resetFields()}
          editingCategory={editingCategory}
        />
        
        <CategoryTable
          categories={filteredCategories}
          loading={loading}
          handleEditData={handleEditData}
          handleDelete={deleteCategory}
        />

        <CategoryPagination
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

export default Categories;
