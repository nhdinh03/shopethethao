import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Checkbox,
  Row,
  Col,
  Button,
  Space,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const AccountModal = ({
  open,
  editUser,
  form,
  FileList,
  statusChecked,
  isStatusEditable,
  handleCancel,
  handleChange,
  onPreview,
  handleStatus,
  handleStatusChange,
  handleResetForm,
  handleModalOk,
}) => {
  return (
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
          <Col xs={24} sm={12}>
            <Form.Item
              name="id"
              label="User Name"
              rules={[{ required: true, message: "Vui lòng nhập User Name!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập User Name" />
            </Form.Item>
          </Col>

          {/* Fullname */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="fullname"
              label="Họ tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
            </Form.Item>
          </Col>

          {/* Phone */}
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12}>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input prefix={<HomeOutlined />} placeholder="Nhập địa chỉ" />
            </Form.Item>
          </Col>

          {/* Birthday */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="birthday"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Chọn ngày sinh"
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>
          </Col>

          {/* Gender */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Select.Option value="M">Nam giới</Select.Option>
                <Select.Option value="F">Nữ giới</Select.Option>
                <Select.Option value="O">Khác</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Image Upload */}
          <Col xs={24} sm={12}>
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

          {/* Verified Status */}
          {editUser && (
            <Col xs={24} sm={12}>
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
            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                valuePropName="checked"
                initialValue={statusChecked}
                disabled={!isStatusEditable}
              >
                <Checkbox onChange={handleStatus}>
                  Tình Trạng Tài khoản
                </Checkbox>
              </Form.Item>
            </Col>
          )}

          {editUser && !statusChecked && (
            <Col span={24}>
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
            </Col>
          )}

          {/* Xóa lý do khóa Button */}
          {editUser && editUser.lockReasons?.length > 0 && (
            <Col span={24}>
              <Button
                type="danger"
                onClick={() => handleStatusChange(editUser.lockReasons[0].id)}
              >
                Xóa lý do khóa
              </Button>
            </Col>
          )}

          {/* Password */}
          {!editUser && (
            <Col xs={24}>
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
            </Col>
          )}
        </Row>

        {/* Action Buttons */}
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
  );
};

export default AccountModal;
