import React from "react";
import { Modal, Form, Input, Select, DatePicker, Upload, Checkbox, Row, Col, Button, Space } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const AccountStaffModal = ({
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
  // Thêm biến kiểm tra tài khoản bị khóa
  const isLockedAccount = editUser && editUser.status === 0;

  return (
    <Modal
      title={editUser ? (isLockedAccount ? "Chi tiết tài khoản bị khóa" : "Cập nhật tài khoản") : "Thêm tài khoản mới"}
      open={open}
      footer={null}
      onCancel={handleCancel}
      width={700}
    >
      <Form 
        form={form} 
        layout="vertical" 
        validateTrigger="onBlur"
      >
        <Row gutter={16}>
          {/* User Name */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="id"
              label="User Name"
              rules={[{ required: true, message: "Vui lòng nhập User Name!" }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Nhập User Name" 
                disabled={isLockedAccount || editUser}
              />
            </Form.Item>
          </Col>

          {/* Fullname */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="fullname"
              label="Họ tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Nhập họ tên" 
                disabled={isLockedAccount}
              />
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
                disabled={isLockedAccount}
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
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Nhập email" 
                disabled={isLockedAccount}
              />
            </Form.Item>
          </Col>

          {/* Address */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input 
                prefix={<HomeOutlined />} 
                placeholder="Nhập địa chỉ" 
                disabled={isLockedAccount}
              />
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
                disabled={isLockedAccount}
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
              <Select 
                placeholder="Chọn giới tính"
                disabled={isLockedAccount}
              >
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
                disabled={isLockedAccount}
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
                <Checkbox disabled={isLockedAccount}>Đã xác thực</Checkbox>
              </Form.Item>
            </Col>
          )}

          {/* Status - Luôn cho phép chỉnh sửa */}
          {editUser && (
            <Col xs={24} sm={12}>
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

          {/* Lock Reason - Chỉ hiện và cho phép sửa khi tài khoản bị khóa */}
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
                initialValue={editUser?.lockReasons?.[0]?.reason || ""}
              >
                <Input.TextArea
                  placeholder="Nhập lý do khóa"
                  rows={4}
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

          {/* Action Buttons */}
          <Col span={24}>
            <Space
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button onClick={handleCancel}>Đóng</Button>
              {isLockedAccount ? (
                <Button 
                  type="primary" 
                  onClick={()=> {
                    form.setFieldsValue({ status: true });
                    handleModalOk();
                  }}
                >
                  Mở khóa tài khoản
                </Button>
              ) : (
                <>
                  <Button onClick={handleResetForm}>Làm mới</Button>
                  <Button type="primary" onClick={handleModalOk}>
                    {editUser ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AccountStaffModal;
