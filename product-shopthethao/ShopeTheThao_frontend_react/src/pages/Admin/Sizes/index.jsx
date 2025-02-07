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

import { BaseModal } from "components/Admin";
import PaginationComponent from "components/PaginationComponent";
import sizeApi from "api/Admin/Sizes/SizesApi";
import { SizeApi } from "api/Admin";
import "..//index.scss";



const Sizes = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  const [searchText, setSearchText] = useState("");
  const [size, setSize] = useState([]);
  const [open, setOpen] = useState(false);
  const [editSize, setEditSize] = useState(null);
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetch product size data with pagination and search
  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await sizeApi.getByPage(currentPage, pageSize, searchText);
        if (isMounted) {
          setSize(res.data);
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

  const handleEditData = (category) => {
    setEditSize(category);
    form.setFieldsValue(category);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await SizeApi.delete(id);
      message.success("Xóa kích thước thành công!");
      setWorkSomeThing([!workSomeThing]); // Update list
    } catch (error) {
      message.error("Không thể xóa kích thước!");
    }
  };

  const handleResetForm = () => {
    form.resetFields();
    setEditSize(null);
  };

  const handleCancel = () => {
    setOpen(false);
    handleResetForm();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editSize) {
        await sizeApi.update(editSize.id, values);
        message.success("Cập nhật kích thước thành công!");
      } else {
        const productData = {
          ...values,
        };
        await sizeApi.create(productData);
        message.success("Thêm kích thước thành công!");
      }
      setOpen(false);
      form.resetFields();
      setEditSize(null);
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Lỗi khi lưu kích thước!");
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset page to 1 when page size changes
  };

  const columns = [
    { title: "🆔 Danh sách", dataIndex: "id", key: "id" },
    { title: "📏 Tên Kích Thước", dataIndex: "name", key: "name" },
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
        <BaseModal
          title={editSize ? "Cập nhật kích thước" : "Thêm kích thước mới"}
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
              {!editSize && <Button onClick={handleResetForm}>Làm mới</Button>}
              <Button type="primary" onClick={handleModalOk}>
                {editSize ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form>
        </BaseModal>
      </Row>
      <div className="table-container">
        <Table
          pagination={false}
          columns={columns}
          loading={loading}
          scroll={{ x: "max-content" }}
          dataSource={size.map((sizes) => ({
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

export default Sizes;
