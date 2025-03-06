import React, { useEffect, useState } from "react";
import {
  message,
  Button,
  Form,
  Row,
} from "antd";
import {
  PlusOutlined,
} from "@ant-design/icons";

import brandsApi from "api/Admin/Brands/Brands";
import ActionColumn from "components/Admin/tableColumns/ActionColumn";
import { BrandsModal, BrandsPagination, BrandsTable } from "components/Admin";
const Brands = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  // const [searchText, setSearchText] = useState("");
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
          // searchText
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
  }, [currentPage, pageSize, workSomeThing]);

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

  // const handleSearch = (value) => {
  //   setSearchText(value);
  //   setCurrentPage(1);
  // };

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
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Quản lý Thương hiệu sản phẩm</h2>

        <div className="header-container">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
            className="add-btn"
          >
            Thêm Thương hiệu
          </Button>
        </div>
      </Row>
      <BrandsTable brands={brands} loading={loading} columns={columns} />

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
  );
};

export default Brands;
