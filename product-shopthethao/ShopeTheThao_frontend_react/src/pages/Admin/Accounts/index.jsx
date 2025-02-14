import React, { useEffect, useState } from "react";
import { message, Button, Form, Row, Select, Tag, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AccountModal from "./components/AccountModal";
import AccountTabs from "./components/AccountTabs";
import PaginationComponent from "components/PaginationComponent";
import { accountsUserApi, lockreasonsApi } from "api/Admin";
import "../index.scss";
import uploadApi from "api/service/uploadApi";
import dayjs from "dayjs";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";

const Accounts = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [FileList, setFileList] = useState([]);
  const [lockedUser, setLockedUser] = useState([]);
  const [statusChecked, setStatusChecked] = useState(editUser?.status === 1);

  const [showLockReason, setShowLockReason] = useState(true);
  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await accountsUserApi.getByPage(
          currentPage,
          pageSize,
          searchText
        );

        if (isMounted) {
          if (res.data && Array.isArray(res.data)) {
            setUser(res.data);
            setTotalItems(res.totalItems);
            const lockedAccounts = res.data.filter((user) => user.status === 0);
            setUser(res.data.filter((user) => user.status === 1));
            setLockedUser(res.data.filter((user) => user.status === 0));
            setLockedUser(lockedAccounts);
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
  }, [currentPage, pageSize, searchText, refresh, workSomeThing]);
  const [isStatusEditable, setIsStatusEditable] = useState(false);

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

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      let image = FileList.length > 0 ? FileList[0].url.split("/").pop() : null;

      const newUserData = {
        ...values,
        image: image,
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
        roles:
          values.roles?.map((role) =>
            typeof role === "object" ? role.id : role
          ) || [],
        status: statusChecked ? 1 : 0,
        lockReasons:
          showLockReason && !statusChecked && values.lockReasons
            ? [{ reason: values.lockReasons }]
            : [], // Nếu tài khoản đang hoạt động thì không gửi lockReasons
      };

      let res;
      if (editUser) {
        res = await accountsUserApi.update(editUser.id, newUserData);
        message.success("Cập nhật tài khoản thành công!");
      } else {
        res = await accountsUserApi.create(newUserData);
        message.success("Thêm tài khoản thành công!");
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
      console.error("🚨 Lỗi khi thêm/cập nhật tài khoản:", error);
      message.error(error.message || "Không thể thêm/cập nhật tài khoản!");
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const columns = [
    { title: "🆔 ID", dataIndex: "id", key: "id" },
    { title: "📞 Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "👤 Họ tên", dataIndex: "fullname", key: "fullname" },
    { title: "🏠 Địa chỉ", dataIndex: "address", key: "address" },
    { title: "✉️ Email", dataIndex: "email", key: "email" },
    { title: "🎂 Ngày sinh", dataIndex: "birthday", key: "birthday" },
    {
      title: "👫 Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => {
        switch (gender) {
          case "M":
            return "Nam giới";
          case "F":
            return "Nữ giới";
          case "O":
            return "Khác";
          default:
            return "Không xác định";
        }
      },
    },
    {
      title: "🖼️ Ảnh đại diện",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={`http://localhost:8081/api/upload/${image}`}
            alt="Ảnh đại diện"
            width={80}
            height={80}
            style={{
              objectFit: "contain",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
        ) : (
          <span>Không có ảnh</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "verified",
      key: "verified",
      render: (verified) =>
        verified ? (
          <Tag color="green">Đã xác minh</Tag>
        ) : (
          <Tag color="red">Chưa xác minh</Tag>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === 0 ? (
          <Tag color="red">Tạm Khóa</Tag>
        ) : (
          <Tag color="green">Đang hoạt động</Tag>
        ),
    },
    { title: "⭐ Điểm", dataIndex: "points", key: "points" },
    {
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      render: (roles) => {
        if (Array.isArray(roles)) {
          return roles.length > 0 ? (
            roles.map((role) => (
              <Tag color="blue" key={role.id}>
                {role.name}
              </Tag>
            ))
          ) : (
            <Tag color="gray">Chưa có</Tag>
          );
        }
        return <Tag color="gray">Chưa có</Tag>;
      },
    },
    ActionColumn(handleEditData, handleDelete),
  ];
  const lockedColumns = [
    // Ẩn cột ID
    { title: "🆔 ID", dataIndex: "id", key: "id" },

    // Ẩn cột Số điện thoại
    {
      title: "📞 Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },

    // Hiển thị cột Họ tên
    { title: "👤 Họ tên", dataIndex: "fullname", key: "fullname" },

    // Ẩn cột Địa chỉ
    {
      title: "🏠 Địa chỉ",
      dataIndex: "address",
      key: "address",
    },

    // Hiển thị cột Email
    { title: "✉️ Email", dataIndex: "email", key: "email" },

    // Ẩn cột Ngày sinh
    {
      title: "🎂 Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
    },

    // Cột Trạng thái
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span>
          {status === 0 ? (
            <Tag color="red">Đã khóa</Tag>
          ) : (
            <Tag color="green">Đang hoạt động</Tag>
          )}
        </span>
      ),
      editable: true,
    },

    // Cột Lý do khóa
    {
      title: "Lý do khóa",
      dataIndex: "lockReasons",
      key: "lockReasons",
      render: (lockReasons) => {
        return lockReasons && lockReasons.length > 0 ? (
          lockReasons.map((lockReason) => (
            <div key={lockReason.id}>
              <span>{lockReason.reason}</span>
            </div>
          ))
        ) : (
          <span>Không có lý do</span>
        );
      },
      editable: true, // Cho phép chỉnh sửa
    },

    // Cột hành động
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditData(record)}>
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
        <h2>Quản lý tài khoản</h2>
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
        handleStatusChange={handleStatusChange}
        handleResetForm={handleResetForm}
        handleModalOk={handleModalOk}
      />

      <AccountTabs
        loading={loading}
        user={user}
        lockedUser={lockedUser}
        columns={columns}
        lockedColumns={lockedColumns}
      />

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10px",
        gap: "10px",
      }}>
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

export default Accounts;
