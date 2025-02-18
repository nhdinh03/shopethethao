import React, { useState } from "react";
import { Modal, Row, Col, Input, Select, Upload, Button, Form } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "pages/Admin/Products/Products.module.scss";


const ProductModal = ({
  open,
  editingProduct,
  handleModalOk,
  handleModalCancel,
  FileList,
  handleUploadChange,
  totalQuantity,
  categories,
  sizes,
  handleSizeChange,
  handleSizeQuantityChange,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [form] = Form.useForm();
  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        </div>
      }
      open={open}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      centered
      className={styles.modalWidth} // Áp dụng kích thước chuẩn
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Mô tả sản phẩm"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả sản phẩm!",
                },
              ]}
            >
              <Input.TextArea rows={2} placeholder="Nhập mô tả sản phẩm" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="totalQuantity" label="Tổng số lượng">
              <Input value={totalQuantity} disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="categorie"
              label="Chọn danh mục"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Chọn danh mục"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={categories?.map((categorie) => ({
                  value: categorie.id,
                  label: categorie.name,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Upload ảnh */}
        <Row gutter={16} justify="space-between">
          <Form.Item
            label="Hình ảnh sản phẩm"
            name="images"
            rules={[
              {
                required: true,
                message: "Vui lòng tải lên ít nhất một hình ảnh!",
              },
            ]}
          >
            <Upload
              beforeUpload={() => false}
              accept=".png, .jpg, .jpeg"
              listType="picture-card"
              fileList={FileList}
              onChange={handleUploadChange}
              multiple
            >
              {FileList.length < 5 && "+ Upload"}
            </Upload>
          </Form.Item>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="price"
              label="Giá sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
                {
                  validator: (_, value) => {
                    if (!value || isNaN(value) || value < 1000) {
                      return Promise.reject(
                        new Error("Giá sản phẩm không thể nhỏ hơn 1,000 VND!")
                      );
                    }
                    if (value > 1000000000) {
                      return Promise.reject(
                        new Error("Giá sản phẩm không thể vượt quá 1 tỷ VND!")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                min={1000}
                max={1000000000}
                step={1000}
                placeholder="Nhập giá sản phẩm (VND)"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.List
          name="sizes"
          initialValue={
            editingProduct
              ? editingProduct.sizes.map((size) => ({
                  size: size.size.id,
                  quantity: size.quantity,
                  price: size.price,
                }))
              : []
          }
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Row key={key} gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, "size"]}
                      label="Kích cỡ"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn kích cỡ!",
                        },
                      ]}
                    >
                      <Select
                        options={sizes.map((size) => ({
                          value: size.id,
                          label: size.name,
                        }))}
                        onChange={(value) => handleSizeChange(value, name)} // Đảm bảo mỗi lần thay đổi gọi hàm kiểm tra trùng
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      label="Số lượng"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số lượng lớn hơn 1!",
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        min={1}
                        onChange={(e) => {
                          const value = Math.max(0, e.target.value);
                          handleSizeQuantityChange(value, name);
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, "price"]}
                      label="Giá"
                    >
                      <Input type="number" min={0} />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Button
                      type="danger"
                      onClick={() => remove(name)}
                      icon={<MinusCircleOutlined />}
                      block
                    >
                      Xoá kích cỡ
                    </Button>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  block
                >
                  Thêm kích cỡ
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img
          alt="example"
          style={{
            width: "100%",
            objectFit: "contain",
          }}
          src={previewImage}
          onError={() => setPreviewImage(null)}
        />
      </Modal>
    </Modal>
  );
};

export default ProductModal;
