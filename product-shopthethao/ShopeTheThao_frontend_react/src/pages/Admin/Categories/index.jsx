import React, { useEffect, useState } from "react";
import { message, Button, Form, Tooltip, Row, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { categoriesApi } from "api/Admin";
import "..//index.scss";
import {
  CategoryTable,
  CategoryPagination,
  CategoryModal,
} from "components/Admin";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";

const Categories = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;
  const [categories, setCategories] = useState([]);

  const [searchedColumn, setSearchedColumn] = useState("");
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [workSomeThing, setWorkSomeThing] = useState(false); // cập nhật danh sách
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await categoriesApi.getByPage(currentPage, pageSize);
        if (isMounted) {
          setCategories(res.data);
          setTotalItems(res.totalItems);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách danh mục. Vui lòng thử lại!");
      }
    };
    getList();
  }, [currentPage, pageSize, workSomeThing]);


  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);

      const isDuplicate = categories.some(
        (category) =>
          category.name.trim().toLowerCase() ===
            values.name.trim().toLowerCase() &&
          (!editingCategory || category.id !== editingCategory.id)
      );
      if (isDuplicate) {
        message.error("Tên danh mục đã tồn tại, vui lòng chọn tên khác!");
        return;
      }

      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, values);
        message.success("Cập nhật danh mục thành công!");
      } else {
        await categoriesApi.create(values);
        message.success("Thêm danh mục thành công!");
      }

      setOpen(false);
      form.resetFields();
      setEditingCategory(null);
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Không thể thực hiện thao tác. Vui lòng thử lại!");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await categoriesApi.delete(id);
      message.success(response.data || "Xóa danh mục thành công!");
      console.log(response);
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          message.error(
            error.response.data ||
              "Không thể xóa danh mục do dữ liệu tham chiếu!"
          );
        } else if (error.response.status === 404) {
          message.error("Danh mục không tồn tại hoặc đã bị xóa!");
        } else {
          message.error("Lỗi không xác định khi xóa danh mục!");
        }
      } else {
        message.error("Không thể kết nối đến máy chủ!");
      }
    }
  };

  const handleEditData = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setOpen(true);
  };

  //phan trang 50
  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); 
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
    ActionColumn(handleEditData, handleDelete),
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
