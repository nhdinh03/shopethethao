import React, { useEffect, useState } from "react";
import {
  message,
  Button,
  Form,
  Row,
  Select,
  Tag,
  Space,
  Tooltip,
  Popconfirm,

  Col,
  Input,
  Table,
} from "antd";
import {
  PlusOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import PaginationComponent from "components/User/PaginationComponent";
import { accountsUserApi, lockreasonsApi } from "api/Admin";
import "./accounts.scss";
import uploadApi from "api/service/uploadApi";
import dayjs from "dayjs";
import { AccountModal } from "components/Admin";

const Accounts = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
const [workSomeThing, setWorkSomeThing] = useState(false);
  const [FileList, setFileList] = useState([]);
  const [statusChecked, setStatusChecked] = useState(editUser?.status === 1);
  const [isStatusEditable, setIsStatusEditable] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await accountsUserApi.getByPage(currentPage, pageSize);

        if (isMounted) {
          if (res.data && Array.isArray(res.data)) {
            setUser(res.data);
            setTotalItems(res.totalItems);
            // Kiểm tra và điều chỉnh trang hiện tại nếu cần
            if (currentPage > res.totalPages && res.totalPages > 0) {
              setCurrentPage(res.totalPages);
            }
          } else {
            message.error("Dữ liệu không hợp lệ từ API!");
          }
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách tài khoản. Vui lòng thử lại!");
        setLoading(false);
      }
    };
    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, refresh]);

  const handleChange = async ({ fileList }) => {
    setFileList(fileList);

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj || fileList[0];

      const uploadedImage = await uploadApi.post(file);

      if (uploadedImage) {
        setFileList([
          {
            uid: file.uid,
            name: file.name,
            url: `http://localhost:8081/api/upload/${uploadedImage}`,
          },
        ]);
      }
    }
  };

  const handleEditData = (record) => {
    setEditUser(record);
    setOpen(true);

    // Enable checkbox when editing
    setIsStatusEditable(true);

    form.setFieldsValue({
      ...record,
      birthday: record.birthday ? dayjs(record.birthday) : null,
      roles: record.roles ? record.roles.map((role) => role.id) : [],
      status: record.status || 0,
      verified: record.verified || false,
      lockReasons: record.lockReasons?.[0]?.reason || "",
    });

    setStatusChecked(record.status === 1);
    const newUploadFile = record.image
      ? [
          {
            uid: record.id.toString(),
            name: record.image,
            url: `http://localhost:8081/api/upload/${record.image}`,
          },
        ]
      : [];
    setFileList(newUploadFile);
  };

  const handleStatus = (e) => {
    const isChecked = e.target.checked;
    setStatusChecked(isChecked); // Cập nhật trạng thái khi người dùng chọn hoặc bỏ chọn checkbox

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

  const handleResetForm = () => {
    form.resetFields();
    setEditUser(null);
  };

  const handleCancel = () => {
    setOpen(false);
    handleResetForm();
    setOpen(false);
    form.resetFields();
    setFileList([]);
    setTimeout(() => {
      form.setFieldsValue({ sizes: [] });
    }, 0);
  };

  const handleDelete = async (id) => {
    try {
      await accountsUserApi.delete(id);
      message.success("Xóa tài khoản thành công!");
      setRefresh(!refresh);
      setWorkSomeThing(!workSomeThing);
    } catch (error) {
      message.error("Không thể xóa tài khoản!");
    }
  };

  const handleStatusChange = async (lockReasonId) => {
    try {
      // Call the API to delete the lock reason
      await lockreasonsApi.delete(lockReasonId);

      // Set the status to active and hide the lock reason
      setEditUser((prevUser) => ({
        ...prevUser,
        status: 1, // Mark as active
        lockReasons: [], // Remove lock reason
      }));
  
      setStatusChecked(true); // Set status to active
      message.success(
        "Xóa lý do khóa thành công! Vui lòng bấm cập nhật để lưu thay đổi."
      );
    } catch (error) {
      console.error("Có lỗi khi xóa lý do khóa:", error);
      message.error("Không thể xóa lý do khóa, vui lòng thử lại!");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let image = FileList.length > 0 ? FileList[0].url.split("/").pop() : null;

      // Format the data according to the API requirements
      const newUserData = {
        ...values,
        image: image,
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
        // Ensure roles is an array of objects with id and name
        roles: values.roles ? values.roles.map(role => {
          return typeof role === 'object' ? role : { id: role, name: 'USER' }
        }) : [{ id: 1, name: 'USER' }], // Default role if none selected
        status: statusChecked ? 1 : 0,
        // If adding lock reason, make it an array of objects
        lockReasons: values.lockReasons ? [{
          reason: values.lockReasons
        }] : []
      };

      let res;
      try {
        if (editUser) {
          // For updating existing user
          res = await accountsUserApi.update(editUser.id, newUserData);
          message.success("Cập nhật tài khoản thành công!");
        } else {
          // For creating new user
          // Ensure required fields for new users
          if (!newUserData.password) {
            throw new Error("Mật khẩu là bắt buộc cho tài khoản mới!");
          }
          res = await accountsUserApi.create(newUserData);
          message.success("Thêm tài khoản thành công!");
        }

        if (res.status === 200 || res.status === 201) {
          setOpen(false);
          form.resetFields();
          setFileList([]);
          setRefresh((prev) => !prev);
          setWorkSomeThing(!workSomeThing);
        }
      } catch (apiError) {
        // Handle specific API errors
        if (apiError.response?.status === 401) {
          message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
          // You might want to redirect to login page here
        } else if (apiError.response?.status === 400) {
          message.error(apiError.response.data.message || "Dữ liệu không hợp lệ!");
        } else {
          throw apiError; // Re-throw other errors
        }
      }
    } catch (error) {
      console.error("🚨 Lỗi khi thêm/cập nhật tài khoản:", error);
      if (error.message) {
        message.error(error.message);
      } else {
        message.error("Không thể thêm/cập nhật tài khoản! Vui lòng thử lại.");
      }
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const getFilteredUsers = () => {
    if (!searchText) return user;

    return user.filter(
      (account) =>
        account.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
        account.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        account.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
        account.address?.toLowerCase().includes(searchText.toLowerCase()) ||
        account.id?.toString().includes(searchText)
    );
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
      onHeaderCell: () => ({
        style: headerStyle
      }),
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
      onHeaderCell: () => ({
        style: headerStyle
      }),
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
      onHeaderCell: () => ({
        style: headerStyle
      }),
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
      title: "⚙️ Thao tác",
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

  return (
    <div className="size-page">
      <div className="content-wrapper">
        <Row justify="space-between" align="middle" className="header-container">
          <h2 className="page-title">Quản lý tài khoản</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
            className="add-btn"
          >
            Thêm tài khoản
          </Button>
        </Row>

        <AccountModal
          open={open}
          editUser={editUser}
          form={form}
          FileList={FileList}
          statusChecked={statusChecked}
          isStatusEditable={isStatusEditable}
          handleCancel={handleCancel}
          handleChange={handleChange}
          onPreview={onPreview}
          handleStatus={handleStatus}
          handleResetForm={handleResetForm}
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
          pagination={false}
          columns={columns}
          loading={loading}
          dataSource={getFilteredUsers().map((user, index) => ({
            ...user,
            key: user.id || index,
          }))}
          scroll={{ x: "max-content" }}
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
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
