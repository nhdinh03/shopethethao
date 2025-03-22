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
  Col,
  message,
} from "antd";
import {
  CheckOutlined,
  FileTextOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useRolesManagement } from "hooks/useRolesManagement";
import PaginationComponent from "components/User/PaginationComponent";
import "./roles.scss";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";
import { useAvailableRoles } from 'hooks/useAvailableRoles';

const Roles = () => {
  const [open, setOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

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

  const availableRoles = useAvailableRoles(roles);

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
        // message.error(error.response.data);
      } else {
        message.error('Có lỗi xảy ra, vui lòng thử lại!');
      }
    }
  };

  // Handle search input change
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Filter roles based on search text
  const getFilteredRoles = () => {
    if (!searchText) return roles;
    
    return roles.filter(role => 
      role.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      role.id?.toString().includes(searchText)
    );
  };

  const filteredRoles = getFilteredRoles();

  // Add header style configuration
  const headerStyle = {
    backgroundColor: "#f0f5ff",
    color: "#1677ff",
    fontWeight: 600,
    borderRight: "1px solid #f0f0f0"
  };

  const columns = [
    { 
      title: "🆔 ID", 
      dataIndex: "id", 
      key: "id",
      width: "10%",
      onHeaderCell: () => ({
        style: headerStyle
      })
    },
    { 
      title: "👥 Tên Vai trò", 
      dataIndex: "name", 
      key: "name",
      width: "35%",
      onHeaderCell: () => ({
        style: headerStyle
      })
    },
    { 
      title: "📝 Mô tả vai trò", 
      dataIndex: "description", 
      key: "description",
      width: "35%",
      onHeaderCell: () => ({
        style: headerStyle
      })
    },
    {
      ...ActionColumn(handleEditData, deleteRole),
      title: "⚙️ Thao tác",
      width: "20%",
      onHeaderCell: () => ({
        style: headerStyle
      })
    },
  ];

  return (
    <div className="size-page">
      <div className="content-wrapper">
        <Row justify="space-between" align="middle" className="header-container">
          <h2 className="page-title">Quản lý Vai trò</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
            className="add-btn"
          >
            Thêm Vai trò mới
          </Button>
        </Row>

        <Row gutter={[16, 16]} className="header-actions">
          <Col xs={24} sm={24} md={24} lg={24}>
            <Input
              placeholder="Tìm kiếm theo tên, mô tả vai trò..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
              allowClear
            />
          </Col>
        </Row>

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
              <Select 
                placeholder="Chọn Vai trò"
                disabled={!availableRoles.length && !editRole}
              >
                {(editRole ? [editRole.name] : availableRoles).map(role => (
                  <Select.Option key={role} value={role}>
                    {role}
                  </Select.Option>
                ))}
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

        <Table
          pagination={false}
          columns={columns}
          loading={loading}
          dataSource={filteredRoles.map((role) => ({
            ...role,
            key: role.id,
          }))}
        />
        
        <div className="pagination-container">
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

export default Roles;
