import React from 'react';
import { Form, Upload, Row } from 'antd';
import { productValidationRules } from 'utils/formValidation';

const ImageUpload = ({ FileList, handleUploadChange }) => (
  <Row gutter={16} justify="space-between">
    <Form.Item
      label="Hình ảnh sản phẩm"
      name="images"
      rules={productValidationRules.images}
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
);

export default ImageUpload;
