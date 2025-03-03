import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import { productValidationRules } from 'utils/formValidation';

const BasicFields = ({ categories, totalQuantity }) => (
  <>
    <Row gutter={16}>
      <Col span={24}>
        <Form.Item name="name" label="Tên sản phẩm" rules={productValidationRules.name}>
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={24}>
        <Form.Item name="description" label="Mô tả sản phẩm" rules={productValidationRules.description}>
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
        <Form.Item name="categorie" label="Chọn danh mục" rules={productValidationRules.categorie}>
          <Select
            style={{ width: "100%" }}
            showSearch
            placeholder="Chọn danh mục"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={categories?.map((categorie) => ({
              value: categorie.id,
              label: categorie.name,
            }))}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={24}>
        <Form.Item name="price" label="Giá sản phẩm" rules={productValidationRules.price}>
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
  </>
);

export default BasicFields;
