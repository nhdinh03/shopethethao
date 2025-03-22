import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Popconfirm,
  Tooltip,
  Select,
  Row,
} from "antd";
import { PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import {
  ProductAttributesModal,
  ProductAttributesPagination,
  ProductAttributesTable,
} from "components/Admin";

import "..//index.scss";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";
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

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await productattributesApi.getByPage(currentPage, pageSize);
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
  }, [currentPage, pageSize, workSomeThing]);

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
      message.success("Xóa kích thước thành công!");
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Không thể xóa kích thước!");
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

  const columns = [
    { title: "🆔 Danh sách", dataIndex: "id", key: "id" },
    { title: "📏 Tên Thuộc tính sản phẩm", dataIndex: "name", key: "name" },
    ActionColumn(handleEditData, handleDelete),
  ];

  return (
    <div className="product-attributes-page">
      <div className="content-wrapper">
        <Row>
          <h2 className="page-title">Thuộc tính sản phẩm</h2>

          <div className="header-container">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpen(true)}
              className="add-btn"
            >
              Thêm kích thước
            </Button>
          </div>
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
          columns={columns}
          productattributes={productattributes}
          loading={loading}
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
