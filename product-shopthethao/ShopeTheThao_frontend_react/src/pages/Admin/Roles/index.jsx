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
      // Form validation error will be handled by antd
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
            Thêm kích thước
          </Button>
        </div>

        <Modal
          title={
            <>
              {editRole ? "✏️ Cập nhật kích thước" : "➕ Thêm kích thước mới"}
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
                { required: true, message: "Vui lòng nhập Tên Vai trò!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập Tên Vai trò" />
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
