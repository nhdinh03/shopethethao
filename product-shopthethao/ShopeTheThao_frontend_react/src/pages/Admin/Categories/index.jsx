import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Popconfirm,
  Tooltip,
  Select,
  Row,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import categoriesApi from "../../../api/Admin/managementGeneral/categoriesApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../..//components/PaginationComponent";
import Highlighter from "react-highlight-words";
import "./Categories.scss";
import BaseModal from "..//..//..//components/Admin/BaseModal";
import productsApi from "..//..//..//api/Admin/Products/productsApi";

const Categories = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [categories, setCategories] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [workSomeThing, setWorkSomeThing] = useState(false); // cập nhật danh sách
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await categoriesApi.getByPage(
          currentPage,
          pageSize,
          searchText
        );
        console.log(res);
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
  }, [currentPage, pageSize, searchText, workSomeThing]);

  const handleEditData = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await categoriesApi.delete(id);
      message.success(response.data || "Xóa danh mục thành công!");
      console.log(response);
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
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

  const handleResetForm = () => {
    form.resetFields();
    setEditingCategory(null);
  };

  const handleCancel = () => {
    setOpen(false);
    handleResetForm();
  };

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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text) => (
        <Tooltip title={text.length > 30 ? text : ""} placement="top">
          <span className="ellipsis-text">
            {text.length > 30 ? `${text.substring(0, 30)}...` : text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Mô tả danh mục",
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
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip>
            <FontAwesomeIcon
              icon={faEdit}
              style={{ color: "#28a745", cursor: "pointer", fontSize: "16px" }}
              onClick={() => handleEditData(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xoá?"
            okText="Đồng ý"
            cancelText="Huỷ"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip>
              <FontAwesomeIcon
                icon={faTrashAlt}
                style={{
                  color: "#dc3545",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
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
        <BaseModal
          title={editingCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
          open={open}
          footer={null}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên danh mục"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục!" },
              ]}
            >
              <Input placeholder="Nhập tên danh mục" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả danh mục"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <Input placeholder="Nhập mô tả" />
            </Form.Item>

            {/* Ẩn nút "Làm mới" khi chỉnh sửa */}
            <Space
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {!editingCategory && (
                <Button onClick={handleResetForm}>Làm mới</Button>
              )}
              <Button type="primary" onClick={handleModalOk}>
                {editingCategory ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form>
        </BaseModal>
      </Row>
      <Table
        columns={columns}
        pagination={false}
        loading={loading}
        dataSource={categories.map((categorie) => ({
          ...categorie,
          key: categorie.id,
        }))}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          gap: 10,
        }}
      >
        {/* Gọi component phân trang */}
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        {/* Dropdown chọn số lượng hàng */}
        <Select
          value={pageSize}
          style={{ width: 120, marginTop: 20 }}
          onChange={(value) => setPageSize(value)}
        >
          <Select.Option value={5}>5 hàng</Select.Option>
          <Select.Option value={10}>10 hàng</Select.Option>
          <Select.Option value={20}>20 hàng</Select.Option>
          <Select.Option value={50}>50 hàng</Select.Option>
        </Select>
      </div>
    </div>
  );
};

export default Categories;
