import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Row,
  message,
} from "antd";
import {
  CheckOutlined,
  FileTextOutlined,
  PlusOutlined,
  RedoOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRolesManagement } from "hooks/useRolesManagement";
import PaginationComponent from "components/PaginationComponent";
import "..//index.scss";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";

const Roles = () => {
  const [open, setOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [form] = Form.useForm();

  const {
    roles,
    loading,
    totalPages,
    currentPage,
    pageSize,
    setCurrentPage,
    handlePageSizeChange,
    createRole,
    updateRole,
    deleteRole
  } = useRolesManagement();

  const handleEditData = (role) => {
    setEditRole(role);
    form.setFieldsValue(role);
    setOpen(true);
  };

  const handleResetForm = () => {
    form.resetFields();
    setEditRole(null);
  };

  const handleCancel = () => {
    setOpen(false);
    handleResetForm();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const success = editRole 
        ? await updateRole(editRole.id, values)
        : await createRole(values);
      
      if (success) {
        setOpen(false);
        handleResetForm();
      }
    } catch (error) {
      if (error.response?.data) {
        message.error(error.response.data);
      }
    }
  };

  const columns = [
    { title: "🆔 Danh sách", dataIndex: "id", key: "id" },
    { title: "📏 Tên Vai trò", dataIndex: "name", key: "name" },
    { title: "📝 Mô tả vai trò", dataIndex: "description", key: "description" },
    ActionColumn(handleEditData, deleteRole),
  ];

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Quản lý Vai trò</h2>
        <div className="header-container">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
            className="add-btn"
          >
            Thêm Vai trò mới
          </Button>
        </div>

        <Modal
          title={
            <>
              {editRole ? "✏️ Cập nhật vai trò" : "➕ Thêm vai trò mới"}
            </>
          }
          open={open}
          footer={null}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên Vai trò"
              rules={[
                { required: true, message: "Vui lòng chọn Vai trò!" },
                {
                  pattern: /^(ADMIN|USER|MANAGER|SUPPLIER|STAFF)$/,
                  message: "Vai trò không hợp lệ!"
                }
              ]}
            >
              <Select placeholder="Chọn Vai trò">
                <Select.Option value="ADMIN">ADMIN</Select.Option>
                <Select.Option value="USER">USER</Select.Option>
                <Select.Option value="MANAGER">MANAGER</Select.Option>
                <Select.Option value="SUPPLIER">SUPPLIER</Select.Option>
                <Select.Option value="STAFF">STAFF</Select.Option>
              </Select>
            </Form.Item>

            {/* Trường Nhập Mô Tả Vai Trò */}
            <Form.Item
              name="description"
              label="Mô tả vai trò"
              rules={[
                { required: true, message: "Vui lòng nhập Mô tả vai trò!" },
              ]}
            >
              <Input
                prefix={<FileTextOutlined />}
                placeholder="Nhập Mô tả vai trò"
              />
            </Form.Item>
            <Space
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {!editRole && (
                <Button icon={<RedoOutlined />} onClick={handleResetForm}>
                  Làm mới
                </Button>
              )}
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleModalOk}
              >
                {editRole ? "Cập nhật" : "Thêm mới"}
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
          dataSource={roles.map((role) => ({
            ...role,
            key: role.id,
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

export default Roles;
