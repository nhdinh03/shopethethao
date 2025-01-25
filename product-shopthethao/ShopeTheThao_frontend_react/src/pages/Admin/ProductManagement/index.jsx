import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Space,
  Table,
  Form,
  Modal,
  Popconfirm,
  message,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import "./Products.module.scss";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Load dữ liệu sản phẩm
  useEffect(() => {
    const mockProducts = [
      { key: "1", name: "Sản phẩm A", category: "Loại 1", price: 100000 },
      { key: "2", name: "Sản phẩm B", category: "Loại 2", price: 200000 },
      { key: "3", name: "Sản phẩm C", category: "Loại 1", price: 150000 },
      { key: "4", name: "Sản phẩm D", category: "Loại 3", price: 300000 },
      { key: "5", name: "Sản phẩm E", category: "Loại 2", price: 250000 },
    ];
    setProducts(mockProducts);
  }, []);

  // Chỉnh sửa sản phẩm
  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setOpen(true);
  };

  // Xóa sản phẩm
  const handleDelete = (key) => {
    setProducts(products.filter((product) => product.key !== key));
    message.success("Xóa sản phẩm thành công!");
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]); // Lưu giá trị tìm kiếm
    setSearchedColumn(dataIndex); // Đặt cột đang được tìm kiếm
  };
  
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText(""); // Xóa giá trị tìm kiếm
  };
  

  // Lưu sản phẩm mới hoặc chỉnh sửa
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.key === editingProduct.key
              ? { ...product, ...values }
              : product
          )
        );
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        setProducts((prevProducts) => [
          ...prevProducts,
          { ...values, key: `${Date.now()}` },
        ]);
        message.success("Thêm sản phẩm thành công!");
      }
      setOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleModalCancel = () => {
    setOpen(false);
    form.resetFields();
    setEditingProduct(null);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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

  // Cột của bảng
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "category",
      key: "category",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: (
        
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          
          Thêm
        </Button>
      ),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#0074D9" }} />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "red" }} />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="product-management">
      <Table
        columns={columns}
        dataSource={products}
        pagination={{ pageSize: 5 }}
        style={{ marginTop: "20px", borderRadius: "8px", overflow: "hidden" }}
      />

      <Modal
        title={editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        open={open}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingProduct ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Loại sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập loại sản phẩm!" }]}
          >
            <Input placeholder="Nhập loại sản phẩm" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
          >
            <Input placeholder="Nhập giá sản phẩm" type="number" />
          </Form.Item>
        </Form>
        
      </Modal>
    </div>
  );
};

export default ProductManagement;
