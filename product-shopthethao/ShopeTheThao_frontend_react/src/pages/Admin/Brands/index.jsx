import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Button,
  Space,
  Modal,
  Typography,
  Form,
  Input,
  Popconfirm,
  Tooltip,
  Select,
  Row,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "components/PaginationComponent";
import brandsApi from "api/Admin/Brands/Brands";
import styles from "..//index.scss";





const Brands = () => {
  
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  const [searchText, setSearchText] = useState("");
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [workSomeThing, setWorkSomeThing] = useState(false); // cập nhật danh sách
  const [form] = Form.useForm();
  const { Title, Text } = Typography;

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await brandsApi.getByPage(
          currentPage,
          pageSize,
          searchText
        );
        if (isMounted) {
          setBrands(res.data);
          setTotalItems(res.totalItems);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách thương hiệu. Vui lòng thử lại!");
        setLoading(false);
      }
    };
    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, searchText, workSomeThing]);

  const handleEditData = (brand) => {
    setEditBrand(brand);
    form.setFieldsValue(brand);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await brandsApi.delete(id);
      message.success("Xóa Thương hiệu thành công!");
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Không thể xóa Thương hiệu!");
    }
  };

  const handleResetForm = () => {
    form.resetFields();
    setEditBrand(null);
  };

  const handleModalCancel = () => {
    setOpen(false);
    handleResetForm();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editBrand) {
        await brandsApi.update(editBrand.id, values);
        message.success("Cập nhật Thương hiệu thành công!");
      } else {
        const productData = { ...values };
        await brandsApi.create(productData);
        message.success("Thêm Thương hiệu thành công!");
      }
      setWorkSomeThing([!workSomeThing]);
      setOpen(false);
      form.resetFields();
      setEditBrand(null);
    } catch (error) {
      message.error("Lỗi khi lưu Thương hiệu!");
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const columns = [
  { title: "🆔 ID", dataIndex: "id", key: "id" },
  {
    title: "🏷️ Tên thương hiệu",
    dataIndex: "name",
    key: "name",
    render: (text) => <Text strong>{text}</Text>,
  },
  { title: "📞 Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber" },
  { title: "📧 Email", dataIndex: "email", key: "email" },
  { title: "🏠 Địa chỉ", dataIndex: "address", key: "address" },
  {
    title: "⚙️ Thao tác",
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
        <h2>Quản lý Thương hiệu sản phẩm</h2>

        <div className="header-container">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
            className="add-btn"
          >
            Thêm Thương hiệu
          </Button>
        </div>
        <Modal
          title={
            <div className={styles.modalTitle}>
              {editBrand ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
            </div>
          }
          open={open}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          centered
          className={styles.modalWidth} 
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên Thương hiệu"
              rules={[
                { required: true, message: "Vui lòng nhập tên Thương hiệu!" },
              ]}
            >
              <Input placeholder="Nhập tên Thương hiệu" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập Số điện thoại!" },
              ]}
            >
              <Input placeholder="Vui lòng nhập Số điện thoại" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập Địa chỉ!" }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Space
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
       
            </Space>
          </Form>
        </Modal>
      </Row>
      <div className="table-container">
        <Table
          pagination={false}
          columns={columns}
          loading={loading}
          scroll={{ x: "max-content" }}
          dataSource={brands.map((brand) => ({ ...brand, key: brand.id }))}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 10,
            gap: 10,
          }}
        >
          <PaginationComponent
            totalPages={totalPages}
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

export default Brands;
