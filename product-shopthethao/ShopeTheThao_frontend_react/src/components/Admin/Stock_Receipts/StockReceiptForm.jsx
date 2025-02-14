import React from 'react';
import { Form, Select, DatePicker, InputNumber, Button, Row, Col } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';

const { Option } = Select;

const StockReceiptForm = ({ form, suppliers, brands, products, editMode }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="🏢 Nhà cung cấp"
        name="supplierId"
        rules={[{ required: true, message: "Chọn nhà cung cấp!" }]}
      >
        <Select placeholder="Chọn nhà cung cấp">
          {suppliers.map((s) => (
            <Select.Option key={s.id} value={s.id}>
              {s.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="🏢 Thương Hiệu"
        name="brandId"
        rules={[{ required: true, message: "Chọn thương hiệu!" }]}
      >
        <Select placeholder="Chọn thương hiệu">
          {brands.map((b) => (
            <Select.Option key={b.id} value={b.id}>
              {b.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Ngày nhập kho"
        name="orderDate"
        rules={[{ required: true, message: "Vui lòng chọn ngày nhập kho" }]}
      >
        <DatePicker
          style={{ width: "100%" }}
          format="DD/MM/YYYY"
          disabledDate={(current) =>
            editMode ? false : current && current.isBefore(moment().startOf("day"))
          }
        />
      </Form.Item>

      <Form.List
        name="receiptProducts"
        initialValue={[]}
        rules={[
          {
            validator: async (_, fields) => {
              if (!fields || fields.length < 1) {
                return Promise.reject(new Error("Ít nhất phải có một sản phẩm!"));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ fieldKey, name }) => (
              <Row gutter={16} key={fieldKey}>
                <Col span={8}>
                  <Form.Item
                    label="Sản phẩm"
                    name={[name, "productId"]}
                    rules={[{ required: true, message: "Chọn sản phẩm!" }]}
                  >
                    <Select placeholder="Chọn sản phẩm">
                      {products.map((product) => (
                        <Option key={product.id} value={product.id}>
                          {product.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Số lượng"
                    name={[name, "quantity"]}
                    rules={[{ required: true, message: "Nhập số lượng!" }]}
                  >
                    <InputNumber min={1} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Giá"
                    name={[name, "price"]}
                    rules={[{ required: true, message: "Nhập giá!" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    danger
                    onClick={() => remove(name)}
                    icon={<FontAwesomeIcon icon={faTrashAlt} />}
                  />
                </Col>
              </Row>
            ))}

            <Button
              type="dashed"
              onClick={() => add()}
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              Thêm sản phẩm
            </Button>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default StockReceiptForm;
