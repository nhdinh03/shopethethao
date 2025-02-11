import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Checkbox,
  Col,
  Upload,
  DatePicker,
  Tag,
  Tabs,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import PaginationComponent from "components/PaginationComponent";
import "..//index.scss";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";
import {
  accountsUserApi,
  lockreasonsApi,
  LockreasonsApi,
  rolesApi,
} from "api/Admin";
import dayjs from "dayjs";
import uploadApi from "api/service/uploadApi";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";

const { TabPane } = Tabs;

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
    setStatusChecked(e.target.checked); // Cập nhật trạng thái khi người dùng chọn hoặc bỏ chọn checkbox
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
      // Gọi API xóa với đúng id của lockReason
      await lockreasonsApi.delete(lockReasonId);
      message.success("Xóa tài khoản thành công!");
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
        // status: values.status ? 1 : 0,
        // lockReasons: values.lockReasons ? [{ reason: values.lockReasons }] : [],

        status: statusChecked ? 1 : 0,
        lockReasons:
          !statusChecked && values.lockReasons
            ? [{ reason: values.lockReasons }]
            : [],
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
    { title: "🆔 ID", dataIndex: "id", key: "id" },
    { title: "📞 Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "👤 Họ tên", dataIndex: "fullname", key: "fullname" },
    { title: "🏠 Địa chỉ", dataIndex: "address", key: "address" },
    { title: "✉️ Email", dataIndex: "email", key: "email" },
    { title: "🎂 Ngày sinh", dataIndex: "birthday", key: "birthday" },
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
          <Tag color="red">Đã khóa</Tag>
        ) : (
          <Tag color="green">Đã xác minh</Tag>
        ),
    },

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
    },

    { title: "⭐ Điểm", dataIndex: "points", key: "points" },
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
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Quản lý tài khoản</h2>

        {/* Thêm tài khoản Button */}
        <div className="header-container">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
            className="add-btn"
          >
            Thêm tài khoản
          </Button>
        </div>

        {/* Tab chứa các bảng */}
        <div className="table-container">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Tài khoản đang hoạt động" key="1">
              <Table
                pagination={false}
                columns={columns}
                loading={loading}
                dataSource={user.map((user, index) => ({
                  ...user,
                  key: user.id || `active-${index}`,
                }))}
              />
            </TabPane>
            <TabPane tab="Tài khoản bị khóa" key="2">
              <Table
                pagination={false}
                columns={lockedColumns}
                loading={loading}
                dataSource={lockedUser.map((user, index) => ({
                  ...user,
                  key: user.id || `locked-${index}`,
                }))}
              />
            </TabPane>
          </Tabs>
        </div>

        {/* Modal chỉnh sửa tài khoản */}
        <Modal
          title={editUser ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}
          open={open}
          footer={null}
          onCancel={handleCancel}
          width={700}
        >
          <Form form={form} layout="vertical" validateTrigger="onBlur">
            <Row gutter={16}>
              {/* User Name */}
              <Col span={12}>
                <Form.Item
                  name="id"
                  label="User Name"
                  rules={[
                    { required: true, message: "Vui lòng nhập User Name!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập User Name"
                  />
                </Form.Item>
              </Col>

              {/* Fullname */}
              <Col span={12}>
                <Form.Item
                  name="fullname"
                  label="Họ tên"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                </Form.Item>
              </Col>

              {/* Phone */}
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Item>
              </Col>

              {/* Email */}
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Vui lòng nhập email hợp lệ!",
                    },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                </Form.Item>
              </Col>

              {/* Address */}
              <Col span={12}>
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[
                    { required: true, message: "Vui lòng nhập địa chỉ!" },
                  ]}
                >
                  <Input prefix={<HomeOutlined />} placeholder="Nhập địa chỉ" />
                </Form.Item>
              </Col>

              {/* Birthday */}
              <Col span={12}>
                <Form.Item
                  name="birthday"
                  label="Ngày sinh"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh!" },
                  ]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày sinh"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              {/* Gender */}
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính!" },
                  ]}
                >
                  <Select placeholder="Chọn giới tính">
                    <Select.Option value="M">Nam giới</Select.Option>
                    <Select.Option value="F">Nữ giới</Select.Option>
                    <Select.Option value="O">Khác</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Image */}
              <Col span={12}>
                <Form.Item
                  label="Ảnh đại diện"
                  name="image"
                  rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
                >
                  <Upload
                    beforeUpload={() => false}
                    accept=".png, .jpg"
                    listType="picture-card"
                    onChange={handleChange}
                    onPreview={onPreview}
                    fileList={FileList}
                    maxCount={1}
                  >
                    {FileList.length < 1 && "+ Upload"}
                  </Upload>
                </Form.Item>
              </Col>

              {/* Verified */}
              {editUser && (
                <Col span={12}>
                  <Form.Item
                    name="verified"
                    label="Xác thực"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Checkbox>Đã xác thực</Checkbox>
                  </Form.Item>
                </Col>
              )}

              {/* Status */}
              {editUser && (
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="Trạng thái"
                    valuePropName="checked"
                    initialValue={statusChecked}
                  >
                    <Checkbox onChange={handleStatus}>
                      Tình Trạng Tài khoản
                    </Checkbox>
                  </Form.Item>
                </Col>
              )}

              {/* Lock Reasons */}
              {editUser && !statusChecked && (
                <Form.Item
                  name="lockReasons"
                  label="Lý do khóa"
                  rules={[
                    {
                      required: !statusChecked,
                      message: "Vui lòng nhập lý do khóa!",
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Nhập lý do khóa"
                    rows={4}
                    defaultValue={editUser?.lockReasons?.[0]?.reason || ""}
                  />
                </Form.Item>
              )}

              {/* Xóa lý do khóa Button */}
              {editUser && editUser.lockReasons?.length > 0 && (
                <Button
                  type="danger"
                  onClick={() => handleStatusChange(editUser.lockReasons[0].id)}
                >
                  Xóa lý do khóa
                </Button>
              )}

              {/* Password */}
              {!editUser && (
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              )}
            </Row>

            {/* Buttons */}
            <Space
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button onClick={handleResetForm}>Làm mới</Button>
              <Button type="primary" onClick={handleModalOk}>
                {editUser ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form>
        </Modal>
      </Row>

      <div className="table-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
            onChange={handlePageSizeChange}
          >
            <Select.Option value={5}>5 hàng</Select.Option>s
            <Select.Option value={10}>10 hàng</Select.Option>
            <Select.Option value={20}>20 hàng</Select.Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
