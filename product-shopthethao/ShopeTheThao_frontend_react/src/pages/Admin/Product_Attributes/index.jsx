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
import { BaseModal } from "components/Admin";
import PaginationComponent from "components/PaginationComponent";
import "..//index.scss";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";
import productattributesApi from "api/Admin/Product_Attributes/productattributesApi";



const ProductAttributes = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  const [searchText, setSearchText] = useState("");

  const [open, setOpen] = useState(false);
  const [editProductAttributes, setEditProductAttributes] = useState(null);
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [productattributes, setProductAttributes] = useState([]);

  // Fetch product size data with pagination and search
  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await productattributesApi.getByPage(currentPage, pageSize, searchText);
        if (isMounted) {
          setProductAttributes(res.data);
          setTotalItems(res.totalItems);
          setLoading(false);
        }
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

  const handleEditData = (ProductAttributes) => {
    setEditProductAttributes(ProductAttributes);
    form.setFieldsValue(ProductAttributes);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await productattributesApi.delete(id);
      message.success("Xóa kích thước thành công!");
      setWorkSomeThing([!workSomeThing]); // Update list
    } catch (error) {
      message.error("Không thể xóa kích thước!");
    }
  };

  const handleResetForm = () => {
    form.resetFields();
    setEditProductAttributes(null);
  };

  const handleCancel = () => {
    setOpen(false);
    handleResetForm();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editProductAttributes) {
        await productattributesApi.update(editProductAttributes.id, values);
        message.success("Cập nhật Thuộc tính sản phẩm thành công!");
      } else {
        const productData = {
          ...values,
        };
        await productattributesApi.create(productData);
        message.success("Thêm Thuộc tính sản phẩm thành công!");
      }
      setOpen(false);
      form.resetFields();
      setEditProductAttributes(null);
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Lỗi khi lưu Thuộc tính sản phẩm!");
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset page to 1 when page size changes
  };

  const columns = [
    { title: "🆔 Danh sách", dataIndex: "id", key: "id" },
    { title: "📏 Tên Thuộc tính sản phẩm", dataIndex: "name", key: "name" },
    ActionColumn(handleEditData, handleDelete),
  ];

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Thuộc tính sản phẩm</h2>
     
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
          title={editProductAttributes ? "Cập nhật kích thước" : "Thêm kích thước mới"}
          open={open}
          footer={null}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên kích thước"
              rules={[
                { required: true, message: "Vui lòng nhập tên kích thước!" },
              ]}
            >
              <Input placeholder="Nhập tên kích thước" />
            </Form.Item>
            <Space
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {!editProductAttributes && <Button onClick={handleResetForm}>Làm mới</Button>}
              <Button type="primary" onClick={handleModalOk}>
                {editProductAttributes ? "Cập nhật" : "Thêm mới"}
              </Button>
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
          dataSource={productattributes.map((sizes) => ({
            ...sizes,
            key: sizes.id,
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


  export default ProductAttributes;
  