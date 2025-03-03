import React from 'react';
import { Form, Input, Select, Row, Col, Upload } from 'antd';
import SizeFields from './FormFields/SizeFields';

const ProductForm = ({ 
  form, 
  categories, 
  sizes, 
  totalQuantity, 
  FileList, 
  handleUploadChange,
  handleSizeChange, 
  handleSizeQuantityChange,
  handleFormValuesChange 
}) => {
  return (
    <Form 
      form={form} 
      layout="vertical"
      onValuesChange={handleFormValuesChange}
    >
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
            rules={[
              { required: true, message: "Vui lòng chọn danh mục" },
            ]}
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
                      new Error(
                        "Giá sản phẩm không thể nhỏ hơn 1,000 VND!"
                      )
                    );
                  }
                  if (value > 1000000000) {
                    return Promise.reject(
                      new Error(
                        "Giá sản phẩm không thể vượt quá 1 tỷ VND!"
                      )
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

      <SizeFields 
        sizes={sizes} 
        handleSizeChange={handleSizeChange}
        handleSizeQuantityChange={handleSizeQuantityChange}
      />
    </Form>
  );
};

export default ProductForm;
