import React, { useEffect, useState } from "react";
import {
  message,
  Button,
  Form,
  Row,
  Col,
  Input
} from "antd";
import {
  PlusOutlined,
  SearchOutlined
} from "@ant-design/icons";

import brandsApi from "api/Admin/Brands/Brands";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";
import { BrandsModal, BrandsPagination, BrandsTable } from "components/Admin";
import "./brands.scss";

const Brands = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  const [searchText, setSearchText] = useState("");
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [workSomeThing, setWorkSomeThing] = useState(false); // cập nhật danh sách
  const [form] = Form.useForm();


  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await brandsApi.getByPage(
          currentPage,
          pageSize,
          searchText
        );
        if (isMounted) {
          setBrands(res.data);
          setTotalItems(res.totalItems);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách thương hiệu. Vui lòng thử lại!");
        setLoading(false);
      }
    };
    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, searchText, workSomeThing]);

  const handleEditData = (brand) => {
    setEditBrand(brand);
    form.setFieldsValue(brand);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await brandsApi.delete(id);
      message.success("Xóa Thương hiệu thành công!");
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Không thể xóa Thương hiệu!");
    }
  };

  const handleResetForm = () => {
    form.resetFields();
    setEditBrand(null);
  };

  const handleModalCancel = () => {
    setOpen(false);
    handleResetForm();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editBrand) {
        await brandsApi.update(editBrand.id, values);
        message.success("Cập nhật Thương hiệu thành công!");
      } else {
        const productData = { ...values };
        await brandsApi.create(productData);
        message.success("Thêm Thương hiệu thành công!");
      }
      setWorkSomeThing([!workSomeThing]);
      setOpen(false);
      form.resetFields();
      setEditBrand(null);
    } catch (error) {
      message.error("Lỗi khi lưu Thương hiệu!");
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
    console.log("Searching for:", value);
  };

  const columns = [
    { title: "🆔 ID", dataIndex: "id", key: "id", width: 80 },
    {
      title: "🏷️ Tên thương hiệu",
      dataIndex: "name",
      key: "name",
    },
    { title: "📞 Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "📧 Email", dataIndex: "email", key: "email" },
    { title: "🏠 Địa chỉ", dataIndex: "address", key: "address" },
    ActionColumn(handleEditData, handleDelete),
  ];

  return (
    <div className="brands-page">
      <div className="content-wrapper">
        <h2 className="page-title">Quản lý Thương hiệu sản phẩm</h2>

        <Row gutter={[16, 16]} className="header-actions">
          <Col xs={24} sm={14} md={16} lg={18}>
            <Input
              placeholder="Tìm kiếm thương hiệu..."
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
              Thêm Thương hiệu
            </Button>
          </Col>
        </Row>

        <div className="table-container">
          <BrandsTable brands={brands} loading={loading} columns={columns} />
        </div>

        <BrandsModal
          open={open}
          editBrand={editBrand}
          handleModalCancel={handleModalCancel}
          handleModalOk={handleModalOk}
          form={form}
        />
        
        <BrandsPagination
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

export default Brands;
