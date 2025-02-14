import React, { useState } from "react";
import { Button, Form, Tooltip, Row, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "..//index.scss";
import {
  CategoryTable,
  CategoryPagination,
  CategoryModal,
} from "components/Admin";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";
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

  const columns = [
    { title: "🆔 ID", dataIndex: "id", key: "id" },
    {
      title: "📂 Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tooltip title={text || "Không có tên dan mục"} placement="top">
          <span className="ellipsis-text">
            {text?.length > 35
              ? `${text.substring(0, 15)}...`
              : text || "Không có tên danh mục"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "📝 Mô tả danh mục",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Tooltip title={text.length > 50 ? text : ""} placement="top">
          <span className="ellipsis-text">
            {text.length > 50 ? `${text.substring(0, 50)}...` : text}
          </span>
        </Tooltip>
      ),
    },
    ActionColumn(handleEditData, deleteCategory),
  ];

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
        columns={columns}
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
