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
import { accountsUserApi, rolesApi } from "api/Admin";
import dayjs from "dayjs";
import uploadApi from "api/service/uploadApi";
import Item from "antd/es/list/Item";

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
  const [roles, setRoles] = useState([]); // Lưu danh sách quyền từ API
  const [resetForm, setResetForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await rolesApi.getByPage();
        setRoles(res.data);
      } catch (error) {
        message.error("Lỗi khi tải danh sách quyền!");
      }
    };
    fetchRoles();
  }, []);

  // Fetch dữ liệu user từ API
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
          // Kiểm tra dữ liệu trước khi set state
          if (res.data && Array.isArray(res.data)) {
            setUser(res.data);
            setTotalItems(res.totalItems);
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
    setFileList(fileList); // ✅ Cập nhật danh sách ảnh trên UI

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj || fileList[0]; // ✅ Lấy ảnh gốc
      console.log("📤 Ảnh chuẩn bị upload:", file);

      const uploadedImage = await uploadApi.post(file); // ✅ Gửi ảnh lên server
      console.log("🔥 Ảnh sau upload:", uploadedImage);

      if (uploadedImage) {
        setFileList([
          {
            uid: file.uid,
            name: file.name,
            url: `http://localhost:8081/api/upload/${uploadedImage}`, // ✅ Lưu đường dẫn ảnh
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
      verified: record.verified || false, // Chuyển đổi ngày
    });
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
      await accountsUserApi.delete(id);
      message.success("Xóa tài khoản thành công!");
      setWorkSomeThing(!workSomeThing);
      setRefresh(!refresh);
    } catch (error) {
      message.error("Không thể xóa tài khoản!");
    }
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

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("📂 Kiểm tra ảnh trong form:", values.image);

      // ✅ Kiểm tra nếu `fileList` đã có ảnh từ server
      let image = FileList.length > 0 ? FileList[0].url.split("/").pop() : null;
      console.log("🔥 Ảnh cuối cùng gửi API:", image);

      // ✅ Chuẩn bị dữ liệu gửi lên API
      const newUserData = {
        ...values,
        image: image, // ✅ Lấy đúng tên ảnh đã upload
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
        roles:
          values.roles?.map((role) =>
            typeof role === "object" ? role.id : role
          ) || [],
      };

      console.log("📤 Dữ liệu gửi đi:", JSON.stringify(newUserData, null, 2));

      // ✅ Gửi API để thêm tài khoản mới
      const res = await accountsUserApi.create(newUserData);
      console.log("🔄 API Response:", res);

      if (res.status === 200) {
        message.success("Thêm tài khoản thành công!");

        // Reset form và đóng modal
        setWorkSomeThing(!workSomeThing);
        setOpen(false);
        form.resetFields();
        setFileList([]);
        setEditData(null);
        setRefresh((prev) => !prev);
      } else {
        throw new Error(`Lỗi API: ${res.statusText}`);
      }
    } catch (error) {
      console.error("🚨 Lỗi khi thêm tài khoản:", error);
      message.error(error.message || "Không thể thêm tài khoản!");
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  // Định nghĩa cột bảng
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
    { title: "⭐ Điểm", dataIndex: "points", key: "points" },
    {
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      render: (roles) =>
        roles.length > 0 ? (
          roles.map((role) => (
            <Tag color="blue" key={role.id}>
              {role.name}
            </Tag>
          ))
        ) : (
          <Tag color="gray">Chưa có</Tag>
        ),
    },
    ActionColumn(handleEditData, handleDelete),
  ];

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Quản lý tài khoản</h2>
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
        <Modal
          title={editUser ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}
          open={open}
          footer={null}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical" validateTrigger="onBlur">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="id"
                  label="User Name"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                </Form.Item>
              </Col>

              {/* Họ tên */}
              <Col span={12}>
                <Form.Item
                  name="fullname"
                  label="Họ tên"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                </Form.Item>
              </Col>

              {/* Số điện thoại */}
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
                      message: "Vui lòng nhập Email hợp lệ!",
                    },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Nhập Email" />
                </Form.Item>
              </Col>

              {/* Địa chỉ */}
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

              {/* Ngày sinh */}
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

              {/* Giới tính */}
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

              {/* Upload ảnh */}
              <Row gutter={16} justify="space-between">
                <Form.Item
                  label="image"
                  name="image"
                  rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
                >
                  <Upload
                    beforeUpload={(file) => {
                      console.log({ file });
                      return false;
                    }}
                    accept=".png, .jpg"
                    listType="picture-card"
                    onChange={handleChange}
                    onPreview={onPreview}
                    fileList={FileList}
                    name="image"
                    maxCount={1}
                  >
                    {FileList.length < 1 && "+ Upload"}
                  </Upload>
                </Form.Item>
              </Row>

              {/* Xác thực */}
              <Col span={12}>
                <Form.Item
                  name="verified"
                  label="Xác thực"
                  valuePropName="checked"
                >
                  <Checkbox>Đã xác thực</Checkbox>
                </Form.Item>
              </Col>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              {/* Quyền */}
              <Col span={24}>
                <Form.Item
                  name="roles"
                  label="Quyền"
                  rules={[{ required: true, message: "Vui lòng chọn quyền!" }]}
                >
                  <Select mode="multiple" placeholder="Chọn quyền">
                    {roles.map((role) => (
                      <Select.Option key={role.id} value={role.id}>
                        {role.name} - {role.description}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Buttons */}
            <Space
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {!editUser && <Button onClick={handleResetForm}>Làm mới</Button>}
              <Button type="primary" onClick={handleModalOk}>
                {editUser ? "Cập nhật" : "Thêm mới"}
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
          dataSource={
            Array.isArray(user)
              ? user.map((users, index) => ({
                  ...users,
                  key: users.id || `row-${index}`,
                }))
              : []
          }
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
