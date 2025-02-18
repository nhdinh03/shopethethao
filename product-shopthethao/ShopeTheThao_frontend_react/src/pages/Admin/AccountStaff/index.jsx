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
  Alert,
} from "antd";
import {
  PlusOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import PaginationComponent from "components/PaginationComponent";
import { accountsstaffApi, lockreasonsApi } from "api/Admin";
import "./accountsStaff.scss";
import uploadApi from "api/service/uploadApi";
import dayjs from "dayjs";
import AccountStaffModal from "components/Admin/AccountStaff/AccountStaffModal";
import AccountStaffTabs from "components/Admin/AccountStaff/AccountStaffTabs";

const AccountStaff = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  const [accountsStaff, setAccountsStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [FileList, setFileList] = useState([]);
  const [lockedUser, setLockedUser] = useState([]);
  const [statusChecked, setStatusChecked] = useState(editUser?.status === 1);
  const [isStatusEditable, setIsStatusEditable] = useState(false);
  const [showLockReason, setShowLockReason] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await accountsstaffApi.getByPage(currentPage, pageSize);

        if (isMounted) {
          if (res.data && Array.isArray(res.data)) {
            setAccountsStaff(res.data);
            setTotalItems(res.totalItems);
            const lockedAccounts = res.data.filter(
              (staff) => staff.status === 0
            );
            setAccountsStaff(res.data.filter((staff) => staff.status === 1));
            setLockedUser(lockedAccounts);
          } else {
            message.error("Dữ liệu không hợp lệ từ API!");
          }
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách nhân viên. Vui lòng thử lại!");
        setLoading(false);
      }
    };
    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, refresh, workSomeThing]);

  const handleStatusChange = async (lockReasonId) => {
    try {
      // Call the API to delete the lock reason
      await lockreasonsApi.delete(lockReasonId);
      message.success("Xóa lý do khóa thành công!");

      // Set the status to active and hide the lock reason
      setEditUser((prevUser) => ({
        ...prevUser,
        status: 1, // Mark as active
        lockReasons: [], // Remove lock reason
      }));
      setShowLockReason(false); // Hide the lock reason field
      setStatusChecked(true); // Set status to active
    } catch (error) {
      console.error("Có lỗi khi xóa lý do khóa:", error);
      message.error("Không thể xóa lý do khóa, vui lòng thử lại!");
    }
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

  const handleResetForm = () => {
    form.resetFields();
    setEditUser(null);
  };

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

  const handleStatus = (e) => {
    const isChecked = e.target.checked;
    setStatusChecked(isChecked); // Cập nhật trạng thái khi người dùng chọn hoặc bỏ chọn checkbox
    setShowLockReason(!isChecked); // Nếu "Đang hoạt động" (status 1), ẩn lý do khóa, ngược lại thì hiển thị
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
    setEditUser(record);
    setOpen(true);

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

  const handleDelete = async (id) => {
    try {
      await accountsstaffApi.delete(id);
      message.success("Xóa tài khoản thành công!");
      setRefresh(!refresh);
      setWorkSomeThing(!workSomeThing);
    } catch (error) {
      message.error("Không thể xóa tài khoản!");
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      let image = FileList.length > 0 ? FileList[0].url.split("/").pop() : null;

      const newStaffData = {
        ...values,
        image: image,
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
        role: ["STAFF"], // Set default role as STAFF
        status: statusChecked ? 1 : 0,
        lockReasons:
          showLockReason && !statusChecked && values.lockReasons
            ? [{ reason: values.lockReasons }]
            : [],
      };

      let res;
      if (editUser) {
        res = await accountsstaffApi.update(editUser.id, newStaffData);
        message.success("Cập nhật nhân viên thành công!");
      } else {
        res = await accountsstaffApi.create(newStaffData);
        message.success("Thêm nhân viên thành công!");
      }

      if (res.status === 200) {
        setOpen(false);
        form.resetFields();
        setFileList([]);
        setRefresh((prev) => !prev);
        setWorkSomeThing(!workSomeThing);
      } else {
        throw new Error(`Lỗi API: ${res.statusText}`);
      }
    } catch (error) {
      console.error("🚨 Lỗi khi thêm/cập nhật nhân viên:", error);
      message.error(error.message || "Không thể thêm/cập nhật nhân viên!");
    }
  };

  const columns = [
    {
      title: "Thông tin cơ bản",
      children: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: 80,
          className: "column-id",
        },
        {
          title: "Họ tên",
          dataIndex: "fullname",
          key: "fullname",
          width: 180,
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
      title: "Thông tin liên hệ",
      children: [
        {
          title: "Số điện thoại",
          dataIndex: "phone",
          key: "phone",
          width: 140,
          render: (phone) => (
            <Tag icon={<PhoneOutlined />} color="blue">
              {phone}
            </Tag>
          ),
        },
        {
          title: "Địa chỉ",
          dataIndex: "address",
          key: "address",
          width: 200,
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
      title: "Thông tin chi tiết",
      children: [
        {
          title: "Trạng thái",
          width: 150,
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
          title: "Vai trò",
          dataIndex: "roles",
          key: "roles",
          width: 150,
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
      title: "Hành động",
      fixed: "right",
      width: 120,
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

  const lockedColumns = [
    {
      title: "Thông tin người dùng",
      children: [
        {
          title: "ID",
          dataIndex: "id",
          width: 80,
        },
        {
          title: "Họ tên & Email",
          dataIndex: "fullname",
          width: 250,
          render: (text, record) => (
            <div className="locked-user-info">
              <div className="name">{text}</div>
              <div className="email">{record.email}</div>
            </div>
          ),
        },
      ],
    },
    {
      title: "Thông tin khóa",
      children: [
        {
          title: "Trạng thái",
          width: 120,
          render: () => (
            <Tag icon={<LockOutlined />} color="red">
              Đã khóa
            </Tag>
          ),
        },
        {
          title: "Lý do khóa",
          dataIndex: "lockReasons",
          width: 300,
          render: (lockReasons) => (
            <div className="lock-reason">
              {lockReasons && lockReasons.length > 0 ? (
                lockReasons.map((reason) => (
                  <Alert
                    key={reason.id}
                    message={reason.reason}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 8 }}
                  />
                ))
              ) : (
                <span className="no-reason">Không có lý do</span>
              )}
            </div>
          ),
        },
      ],
    },
    {
      title: "Hành động",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleEditData(record)}
          size="small"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <h2>Quản lý nhân viên</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
          className="add-btn"
        >
          Thêm nhân viên
        </Button>
      </Row>

      <AccountStaffModal
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
        handleStatusChange={handleStatusChange}
        handleResetForm={handleResetForm}
        handleModalOk={handleModalOk}
      />

      <AccountStaffTabs
        loading={loading}
        staffList={accountsStaff}
        lockedStaff={lockedUser}
        columns={columns}
        lockedColumns={lockedColumns}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
          gap: "10px",
        }}
      >
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <Select
          value={pageSize}
          style={{ width: 120 }}
          onChange={handlePageSizeChange}
        >
          <Select.Option value={5}>5 hàng</Select.Option>
          <Select.Option value={10}>10 hàng</Select.Option>
          <Select.Option value={20}>20 hàng</Select.Option>
        </Select>
      </div>
    </div>
  );
};

export default AccountStaff;
