import React, { useState } from "react";
import { Button, Form, Row, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
    setCurrentPage,
    pageSize,
    totalPages,
    createCategory,
    updateCategory,
    deleteCategory,
    handlePageSizeChange,
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

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Quản lý danh mục</h2>
        <div className="header-container">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
            className="add-btn"
          >
            Thêm danh mục
          </Button>
        </div>
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
        categories={categories}
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
  );
};

export default Categories;
