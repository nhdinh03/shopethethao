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
import { HomeOutlined, MailOutlined, PhoneOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import PaginationComponent from "components/PaginationComponent";
import { suppliersApi } from "api/Admin";
import "..//index.scss";
import styles from "..//modalStyles.module.scss";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";

const Suppliers = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  const [editsuppliers, setEditSuppliers] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);

  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetch product size data with pagination and search
  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await suppliersApi.getByPage(
          currentPage,
          pageSize,
          searchText
        );
        if (isMounted) {
          setSuppliers(res.data);
          setTotalItems(res.totalItems);
          setLoading(false);
        }
        console.log(res);
      } catch (error) {
        message.error("Không thể lấy danh sách sản phẩm. Vui lòng thử lại!");
        setLoading(false);
      }
    };
    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, searchText, workSomeThing]);

  const handleEditData = (supplier) => {
    setEditSuppliers(supplier);
    form.setFieldsValue(supplier);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await suppliersApi.delete(id);
      message.success("Xóa Nhà cung cấp thành công!");
      setWorkSomeThing([!workSomeThing]); // Update list
    } catch (error) {
      message.error("Không thể xóa Nhà cung cấp!");
    }
  };

  const handleResetForm = () => {
    form.resetFields();
    setEditSuppliers(null);
  };

  const handleModalCancel = () => {
    setOpen(false);
    handleResetForm();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editsuppliers) {
        await suppliersApi.update(editsuppliers.id, values);
        message.success("Cập nhật Nhà cung cấp thành công!");
      } else {
        const productData = {
          ...values,
        };
        await suppliersApi.create(productData);
        message.success("Thêm Nhà cung cấp thành công!");
      }
      setOpen(false);
      form.resetFields();
      setEditSuppliers(null);
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Lỗi khi lưu Nhà cung cấp!");
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset page to 1 when page size changes
  };

  const columns = [
    { title: "📋 Danh sách", dataIndex: "id", key: "id" },
    { title: "🏢 Nhà cung cấp", dataIndex: "name", key: "name" },
    { title: "📧 Email", dataIndex: "email", key: "email" },
    { title: "📞 Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "🏠 Địa chỉ", dataIndex: "address", key: "address" },
    ActionColumn(handleEditData, handleDelete),
  ];

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Quản lý Nhà cung cấp sản phẩm</h2>

        <div className="header-container">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
            className="add-btn"
          >
            Thêm Nhà cung cấp
          </Button>
        </div>
        <Modal
          title={
            <div className={styles.modalTitle}>
              {editsuppliers
                ? "✏️ Cập nhật Nhà cung cấp"
                : "➕ Thêm Nhà cung cấp mới"}
            </div>
          }
          open={open}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          centered
          className={styles.modalWidth}
        >
          <Form form={form} layout="vertical">
    
    {/* Tên Thương hiệu */}
    <Form.Item
      name="name"
      label="Tên Thương hiệu"
      rules={[{ required: true, message: "Vui lòng nhập tên Thương hiệu!" }]}
    >
      <Input prefix={<UserOutlined />} placeholder="Nhập tên Thương hiệu" />
    </Form.Item>

    {/* Số điện thoại */}
    <Form.Item
      name="phoneNumber"
      label="Số điện thoại"
      rules={[{ required: true, message: "Vui lòng nhập Số điện thoại!" }]}
    >
      <Input prefix={<PhoneOutlined />} placeholder="Vui lòng nhập Số điện thoại" />
    </Form.Item>

    {/* Email */}
    <Form.Item
      name="email"
      label="Email"
      rules={[{ required: true, message: "Vui lòng nhập email!" }]}
    >
      <Input prefix={<MailOutlined />} placeholder="Nhập email" />
    </Form.Item>

    {/* Địa chỉ */}
    <Form.Item
      name="address"
      label="Địa chỉ"
      rules={[{ required: true, message: "Vui lòng nhập Địa chỉ!" }]}
    >
      <Input prefix={<HomeOutlined />} placeholder="Nhập địa chỉ" />
    </Form.Item>

  </Form>
        </Modal>
      </Row>
      <div className="table-container">
        <Table
          pagination={false}
          columns={columns}
          loading={loading}
          scroll={{ x: "max-content" }}
          dataSource={suppliers.map((supplier) => ({
            ...supplier,
            key: supplier.id,
          }))}
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
            onChange={handlePageSizeChange} // Reset to page 1 when page size changes
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

export default Suppliers;
