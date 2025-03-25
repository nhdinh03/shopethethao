import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  message,
  Button,
  Form,
  Row,
  Select,
  Tag,
  Tooltip,
  Space,
  Popconfirm,

  Col,
  Input,
  Table,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import PaginationComponent from "components/User/PaginationComponent";
import { accountsstaffApi, lockreasonsApi } from "api/Admin";
import "./accountsStaff.scss";
import uploadApi from "api/service/uploadApi";
import dayjs from "dayjs";
import AccountStaffModal from "components/Admin/AccountStaff/AccountStaffModal";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";

const AccountStaff = () => {
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    pageSize: 5,
  });

  const [staffState, setStaffState] = useState({
    accountsStaff: [],
    loading: false,
    refresh: false,
  });

  const [modalState, setModalState] = useState({
    open: false,
    editUser: null,
    FileList: [],
    statusChecked: false,
    isStatusEditable: false,
    showLockReason: true,
  });

  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const totalPages = useMemo(() => {
    return pagination.totalItems > 0
      ? Math.ceil(pagination.totalItems / pagination.pageSize)
      : 1;
  }, [pagination.totalItems, pagination.pageSize]);

  const fetchStaffData = useCallback(async () => {
    setStaffState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await accountsstaffApi.getByPage(
        pagination.currentPage,
        pagination.pageSize
      );

      if (res.data && Array.isArray(res.data)) {
        setStaffState((prev) => ({
          ...prev,
          accountsStaff: res.data,
          loading: false,
        }));
        setPagination((prev) => ({
          ...prev,
          totalItems: res.totalItems,
        }));
        
        // Adjust current page if needed
        if (pagination.currentPage > res.totalPages && res.totalPages > 0) {
          setPagination(prev => ({
            ...prev,
            currentPage: res.totalPages
          }));
        }
      }
    } catch (error) {
      message.error("Không thể lấy danh sách nhân viên!");
      setStaffState((prev) => ({ ...prev, loading: false }));
    }
  }, [pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData, staffState.refresh]);

  const handleCancel = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      open: false,
      editUser: null,
      FileList: [],
      statusChecked: false,
      isStatusEditable: false,
      showLockReason: true,
    }));
    form.resetFields();
  }, [form]);

  const handleStatusChange = useCallback(
    async (lockReasonId) => {
      try {
        // Delete lock reason
        await lockreasonsApi.delete(lockReasonId);

        // Update modal state but don't submit changes automatically
        setModalState((prev) => ({
          ...prev,
          showLockReason: false,
          statusChecked: true,
        }));

        // Set form status to active
        form.setFieldsValue({ status: true });

        message.success(
          "Xóa lý do khóa thành công! Vui lòng bấm cập nhật để lưu thay đổi."
        );
      } catch (error) {
        console.error("Error deleting lock reason:", error);
        message.error("Không thể xóa lý do khóa!");
      }
    },
    [form]
  );

  const handleChange = async ({ fileList }) => {
    setModalState((prev) => ({ ...prev, FileList: fileList }));

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj || fileList[0];

      const uploadedImage = await uploadApi.post(file);

      if (uploadedImage) {
        setModalState((prev) => ({
          ...prev,
          FileList: [
            {
              uid: file.uid,
              name: file.name,
              url: `http://localhost:8081/api/upload/${uploadedImage}`,
            },
          ],
        }));
      }
    }
  };

  const handleStatus = (e) => {
    const isChecked = e.target.checked;
    setModalState((prev) => ({
      ...prev,
      statusChecked: isChecked,
      showLockReason: !isChecked,
    }));
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleEditData = (record) => {
    setModalState((prev) => ({
      ...prev,
      editUser: record,
      open: true,
      isStatusEditable: true,
      statusChecked: record.status === 1,
      FileList: record.image
        ? [
            {
              uid: record.id.toString(),
              name: record.image,
              url: `http://localhost:8081/api/upload/${record.image}`,
            },
          ]
        : [],
    }));

    form.setFieldsValue({
      ...record,
      birthday: record.birthday ? dayjs(record.birthday) : null,
      roles: record.roles ? record.roles.map((role) => role.id) : [],
      status: record.status || 0,
      verified: record.verified || false,
      lockReasons: record.lockReasons?.[0]?.reason || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await accountsstaffApi.delete(id);
      message.success("Xóa tài khoản thành công!");
      setStaffState((prev) => ({ ...prev, refresh: !prev.refresh }));
    } catch (error) {
      message.error("Không thể xóa tài khoản!");
    }
  };

  const handlePageSizeChange = (value) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: value,
      currentPage: 1,
    }));
  };

  const validateStaffData = (values) => {
    if (!values.id || !values.fullname || !values.phone || !values.email) {
      throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc!");
    }
    if (!/^[0-9]{10}$/.test(values.phone)) {
      throw new Error("Số điện thoại không hợp lệ!");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      throw new Error("Email không hợp lệ!");
    }
    return true;
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      validateStaffData(values);

      const staffData = {
        ...values,
        image: modalState.FileList[0]?.url?.split("/").pop() || null,
        birthday: values.birthday?.isValid()
          ? values.birthday.format("YYYY-MM-DD")
          : null,
        role: ["STAFF"],
        status: modalState.statusChecked ? 1 : 0,
        lockReasons:
          modalState.showLockReason &&
          !modalState.statusChecked &&
          values.lockReasons
            ? [{ reason: values.lockReasons }]
            : [],
      };

      let res;
      try {
        if (modalState.editUser) {
          res = await accountsstaffApi.update(
            modalState.editUser.id,
            staffData
          );
        } else {
          res = await accountsstaffApi.create(staffData);
        }

        if (res.status === 200) {
          message.success(
            `${modalState.editUser ? "Cập nhật" : "Thêm"} nhân viên thành công!`
          );
          handleCancel();
          setStaffState((prev) => ({ ...prev, refresh: !prev.refresh }));
        }
      } catch (error) {
        if (error.response?.status === 500) {
          message.error("Lỗi máy chủ! Vui lòng thử lại sau.");
        } else {
          message.error(error.response?.data?.message || "Có lỗi xảy ra!");
        }
      }
    } catch (error) {
      console.error("Form validation error:", error);
      message.error(error.message || "Vui lòng kiểm tra lại thông tin!");
    }
  };

  // Add header style configuration
  const headerStyle = {
    backgroundColor: "#f0f5ff",
    color: "#1677ff",
    fontWeight: 600,
    borderRight: "1px solid #f0f0f0"
  };

  const columns = [
    {
      title: "Thông tin cơ bản",
      children: [
        {
          title: "🆔 ID",
          dataIndex: "id",
          key: "id",
          width: 80,
          className: "column-id",
          onHeaderCell: () => ({
            style: headerStyle
          })
        },
        {
          title: "👤 Họ tên",
          dataIndex: "fullname",
          key: "fullname",
          width: 180,
          onHeaderCell: () => ({
            style: headerStyle
          }),
          render: (text, record) => (
            <div className="user-info-cell">
              <div className="avatar">
                {record.image ? (
                  <img
                    src={`http://localhost:8081/api/upload/${record.image}`}
                    alt={text}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {text?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-details">
                <div className="fullname">{text}</div>
                <div className="email">{record.email}</div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: "📞 Thông tin liên hệ",
      children: [
        {
          title: "📱 Số điện thoại",
          dataIndex: "phone",
          key: "phone",
          width: 140,
          onHeaderCell: () => ({
            style: headerStyle
          }),
          render: (phone) => (
            <Tag icon={<PhoneOutlined />} color="blue">
              {phone}
            </Tag>
          ),
        },
        {
          title: "📍 Địa chỉ",
          dataIndex: "address",
          key: "address",
          width: 200,
          onHeaderCell: () => ({
            style: headerStyle
          }),
          render: (address) => (
            <Tooltip title={address}>
              <div className="address-cell">
                <EnvironmentOutlined /> {address || "Chưa cập nhật"}
              </div>
            </Tooltip>
          ),
        },
      ],
    },
    {
      title: "ℹ️ Thông tin chi tiết",
      children: [
        {
          title: "📊 Trạng thái",
          width: 150,
          onHeaderCell: () => ({
            style: headerStyle
          }),
          render: (_, record) => (
            <Space direction="vertical" size={4}>
              <Tag color={record.verified ? "green" : "red"}>
                {record.verified ? "Đã xác minh" : "Chưa xác minh"}
              </Tag>
              <Tag color={record.status === 1 ? "green" : "red"}>
                {record.status === 1 ? "Đang hoạt động" : "Tạm khóa"}
              </Tag>
            </Space>
          ),
        },
        {
          title: "👥 Vai trò",
          dataIndex: "roles",
          key: "roles",
          width: 150,
          onHeaderCell: () => ({
            style: headerStyle
          }),
          render: (roles) => (
            <Space size={[0, 4]} wrap>
              {Array.isArray(roles) && roles.length > 0 ? (
                roles.map((role) => (
                  <Tag color="blue" key={role.id}>
                    {role.name}
                  </Tag>
                ))
              ) : (
                <Tag color="default">Chưa có</Tag>
              )}
            </Space>
          ),
        },
      ],
    },
    {
      title: "⚙️ Hành động",
      fixed: "right",
      width: 120,
      onHeaderCell: () => ({
        style: headerStyle
      }),
      render: (_, record) => (
        <Space size="middle" className="action-buttons">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditData(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const getFilteredStaff = () => {
    if (!searchText) return staffState.accountsStaff;
    
    return staffState.accountsStaff.filter(staff => 
      staff.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
      staff.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      staff.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
      staff.address?.toLowerCase().includes(searchText.toLowerCase()) ||
      staff.id?.toString().includes(searchText) ||
      staff.roles?.some(role => 
        role.name?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  return (
    <ErrorBoundary fallback={<div>Đã xảy ra lỗi. Vui lòng thử lại.</div>}>
      <div className="size-page">
        <div className="content-wrapper">
          <Row justify="space-between" align="middle" className="header-container">
            <h2 className="page-title">Quản lý nhân viên</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalState((prev) => ({ ...prev, open: true }))}
              className="add-btn"
            >
              Thêm nhân viên
            </Button>
          </Row>

          <AccountStaffModal
            open={modalState.open}
            editUser={modalState.editUser}
            form={form}
            FileList={modalState.FileList}
            statusChecked={modalState.statusChecked}
            isStatusEditable={modalState.isStatusEditable}
            handleCancel={handleCancel}
            handleChange={handleChange}
            onPreview={onPreview}
            handleStatus={handleStatus}
            handleStatusChange={handleStatusChange}
            handleResetForm={handleCancel}
            handleModalOk={handleModalOk}
          />

          <Row gutter={[16, 16]} className="header-actions">
            <Col xs={24} sm={24} md={24} lg={24}>
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
                allowClear
              />
            </Col>
          </Row>

          <Table
            loading={staffState.loading}
            dataSource={getFilteredStaff()}
            columns={columns}
            pagination={false}
            scroll={{ x: 1300 }}
          />

          <div className="pagination-container">
            <PaginationComponent
              totalPages={totalPages}
              currentPage={pagination.currentPage}
              setCurrentPage={(page) =>
                setPagination((prev) => ({ ...prev, currentPage: page }))
              }
            />
            <Select
              value={pagination.pageSize}
              style={{ width: 120, marginTop: 20 }}
              onChange={handlePageSizeChange}
            >
              <Select.Option value={5}>5 hàng</Select.Option>
              <Select.Option value={10}>10 hàng</Select.Option>
              <Select.Option value={20}>20 hàng</Select.Option>
            </Select>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AccountStaff;
