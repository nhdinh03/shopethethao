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
  Alert,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  LockOutlined,
  PhoneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import PaginationComponent from "components/User/PaginationComponent";
import { accountsstaffApi, lockreasonsApi } from "api/Admin";
import "./accountsStaff.scss";
import uploadApi from "api/service/uploadApi";
import dayjs from "dayjs";
import AccountStaffModal from "components/Admin/AccountStaff/AccountStaffModal";
import AccountStaffTabs from "components/Admin/AccountStaff/AccountStaffTabs";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";

const AccountStaff = () => {
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    pageSize: 5,
  });

  const [staffState, setStaffState] = useState({
    accountsStaff: [],
    lockedUser: [],
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
          accountsStaff: res.data.filter((staff) => staff.status === 1),
          lockedUser: res.data.filter((staff) => staff.status === 0),
          loading: false,
        }));
        setPagination((prev) => ({
          ...prev,
          totalItems: res.totalItems,
        }));
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
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleEditData(record)}
            size="small"
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ErrorBoundary fallback={<div>Đã xảy ra lỗi. Vui lòng thử lại.</div>}>
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

        <AccountStaffTabs
          loading={staffState.loading}
          staffList={staffState.accountsStaff}
          lockedStaff={staffState.lockedUser}
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
    </ErrorBoundary>
  );
};

export default React.memo(AccountStaff);
