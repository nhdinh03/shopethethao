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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import Highlighter from "react-highlight-words";
import "..//index.scss";
import PaginationComponent from "components/User/PaginationComponent";
import { productsSizeApi } from "api/Admin";


const ProductSizes = () => {
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

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await productsSizeApi.getByPage(
          currentPage,
          pageSize,
          searchText
        );
        if (isMounted) {
          setCategories(res.data);
          setTotalItems(res.totalItems);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách sản phẩm. Vui lòng thử lại!");
      }
    };
    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, searchText, workSomeThing]);

  const handleEditData = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await productsSizeApi.delete(id);
      message.success("Xóa kích thước thành công!");
      setWorkSomeThing([!workSomeThing]); // Cập nhật lại danh sách
    } catch (error) {
      message.error("Không thể xóa kích thước!");
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
      if (editingCategory) {
        // Cập nhật thông tin kích cỡ
        await productsSizeApi.update(editingCategory.id, values);
        message.success("Cập nhật kích thước thành công!");
      } else {
        // Thêm kích cỡ mới, đảm bảo truyền product_id vào nếu có
        const productData = { ...values, product_id: editingCategory ? editingCategory.product_id : null }; // Đảm bảo thông tin product_id hợp lệ
        await productsSizeApi.create(productData);
        message.success("Thêm kích thước thành công!");
      }
      setOpen(false);
      form.resetFields();
      setEditingCategory(null);
      setWorkSomeThing([!workSomeThing]); // Cập nhật lại danh sách
    } catch (error) {
      message.error("Lỗi khi lưu kích thước!");
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

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset about page 1 every time the page size changes
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },

    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
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
        <Modal
          title={
            editingCategory ? "Cập nhật kích thước" : "Thêm kích thước mới"
          }
          open={open}
          footer={null}
          onCancel={handleCancel}
        >
        </Modal>
      </Row>
      <div className="table-container">
        <Table
          pagination={false}
          columns={columns}
          loading={loading}
          scroll={{ x: "max-content" }}
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
          <PaginationComponent
            totalPages={totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <Select
            value={pageSize}
            style={{ width: 120, marginTop: 20 }}
            onChange={handlePageSizeChange}
          >
            <Select.Option value={5}>5 hàng</Select.Option>
            <Select.Option value={10}>10 hàng</Select.Option>
            <Select.Option value={20}>20 hàng</Select.Option>
            <Select.Option value={50}>50 hàng</Select.Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProductSizes;
