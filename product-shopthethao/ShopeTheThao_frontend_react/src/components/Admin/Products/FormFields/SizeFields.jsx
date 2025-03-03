import React from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const SizeFields = ({ sizes, handleSizeChange, handleSizeQuantityChange }) => (
  <Form.List name="sizes">
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
                  onChange={(value) => handleSizeChange(value, name)}
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
);

export default SizeFields;
