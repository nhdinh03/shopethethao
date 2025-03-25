import React, { useEffect, useState } from "react";
import {
  message,
  Button,
  Form,
  Input,
  Row,
  Col,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  ProductAttributesModal,
  ProductAttributesPagination,
  ProductAttributesTable,
} from "components/Admin";

import "./productattributes.scss";
import { productattributesApi } from "api/Admin";

const ProductAttributes = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  const [open, setOpen] = useState(false);
  const [editProductAttributes, setEditProductAttributes] = useState(null);
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [productattributes, setProductAttributes] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await productattributesApi.getByPage(currentPage, pageSize ,searchText);
        if (isMounted) {
          setProductAttributes(res.data);
          setTotalItems(res.totalItems);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách sản phẩm. Vui lòng thử lại!");
        setLoading(false);
      }
    };
    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize,searchText, workSomeThing]);

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editProductAttributes) {
        await productattributesApi.update(editProductAttributes.id, values);
        message.success("Cập nhật Thuộc tính sản phẩm thành công!");
      } else {
        const productData = {
          ...values,
        };
        await productattributesApi.create(productData);
        message.success("Thêm Thuộc tính sản phẩm thành công!");
      }
      setOpen(false);
      form.resetFields();
      setEditProductAttributes(null);
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Lỗi khi lưu Thuộc tính sản phẩm!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await productattributesApi.delete(id);
      message.success("Xóa thuộc tính thành công!");
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Không thể xóa thuộc tính!");
    }
  };
  
  const handleEditData = (ProductAttributes) => {
    setEditProductAttributes(ProductAttributes);
    form.setFieldsValue(ProductAttributes);
    setOpen(true);
  };

  const handleResetForm = () => {
    form.resetFields();
    setEditProductAttributes(null);
  };

  const handleCancel = () => {
    setOpen(false);
    handleResetForm();
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    console.log("Searching for:", value);
  };

  // Filter product attributes based on search text
  const filteredAttributes = productattributes.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="product-attributes-page">
      <div className="content-wrapper">
        <h2 className="page-title">Thuộc tính sản phẩm</h2>

        <Row gutter={[16, 16]} className="header-actions">
          <Col xs={24} sm={14} md={16} lg={18}>
            <Input
              placeholder="Tìm kiếm thuộc tính sản phẩm..."
              prefix={<SearchOutlined />}
              className="search-input"
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={10} md={8} lg={6} className="add-button-container">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpen(true)}
              className="add-btn"
            >
              Thêm thuộc tính
            </Button>
          </Col>
        </Row>

        <ProductAttributesModal
          open={open}
          form={form}
          handleModalOk={handleModalOk}
          handleCancel={handleCancel}
          editProductAttributes={editProductAttributes}
          handleResetForm={handleResetForm}
        />
        
        <ProductAttributesTable
          productattributes={filteredAttributes}
          loading={loading}
          handleEditData={handleEditData}
          handleDelete={handleDelete}
        />
        
        <ProductAttributesPagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          handlePageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default ProductAttributes;
