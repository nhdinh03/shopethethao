import React, { useEffect, useState } from "react";
import { Button, message, Modal, Form, Row, Col, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { suppliersApi } from "api/Admin";
import "./suppliers.scss";
import styles from "..//modalStyles.module.scss";
import { SupplierForm, SuppliersTable } from "components/Admin";

const Suppliers = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editsuppliers, setEditSuppliers] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;


  
  // Enhanced data fetching with improved search
  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        // Server-side search via API
        const res = await suppliersApi.getByPage(
          currentPage,
          pageSize,
          searchText
        );

        if (isMounted) {
          let filteredSuppliers = res.data;

          setSuppliers(filteredSuppliers);
          setTotalItems(res.totalItems);
          setLoading(false);
        }
      } catch (error) {
        message.error(
          "Không thể lấy danh sách nhà cung cấp. Vui lòng thử lại!"
        );
        setLoading(false);
      }
    };
    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, searchText, workSomeThing]);


  const handleEditData = (supplier) => {
    setEditSuppliers(supplier);
    form.setFieldsValue(supplier);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await suppliersApi.delete(id);
      message.success("Xóa Nhà cung cấp thành công!");
      setWorkSomeThing([!workSomeThing]); // Update list
    } catch (error) {
      message.error("Không thể xóa Nhà cung cấp!");
    }
  };

  const handleResetForm = () => {
    form.resetFields();
    setEditSuppliers(null);
  };

  const handleModalCancel = () => {
    setOpen(false);
    handleResetForm();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editsuppliers) {
        await suppliersApi.update(editsuppliers.id, values);
        message.success("Cập nhật Nhà cung cấp thành công!");
      } else {
        const productData = {
          ...values,
        };
        await suppliersApi.create(productData);
        message.success("Thêm Nhà cung cấp thành công!");
      }
      setOpen(false);
      form.resetFields();
      setEditSuppliers(null);
      setWorkSomeThing([!workSomeThing]);
    } catch (error) {
      message.error("Lỗi khi lưu Nhà cung cấp!");
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset page to 1 when page size changes
  };

  // Improved search handler
  const handleSearch = (value) => {
    setSearchText(value);
    // Reset to page 1 when searching
    setCurrentPage(1);
  };

  return (
    <div className="suppliers-page">
      <div className="content-wrapper">
        <h2 className="page-title">Quản lý Nhà cung cấp sản phẩm</h2>

        <Row gutter={[16, 16]} className="header-actions">
          <Col xs={24} sm={14} md={16} lg={18}>
            <Input
              placeholder="Tìm kiếm theo ID, tên, email, điện thoại, địa chỉ..."
              prefix={<SearchOutlined />}
              className="search-input"
              onChange={(e) => handleSearch(e.target.value)}
              value={searchText}
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
              Thêm Nhà cung cấp
            </Button>
          </Col>
        </Row>

        <Modal
          title={
            <div className={styles.modalTitle}>
              {editsuppliers
                ? "✏️ Cập nhật Nhà cung cấp"
                : "➕ Thêm Nhà cung cấp mới"}
            </div>
          }
          open={open}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          centered
          className={styles.modalWidth}
        >
          <SupplierForm form={form} />
        </Modal>

        <div className="table-container">
          <SuppliersTable
            loading={loading}
            suppliers={suppliers}
            handleEditData={handleEditData}
            handleDelete={handleDelete}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            handlePageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
