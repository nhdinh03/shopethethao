import React, { useEffect, useState } from "react";
import { Button, message, Modal, Form, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { suppliersApi } from "api/Admin";
import "..//index.scss";
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

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await suppliersApi.getByPage(currentPage, pageSize, searchText);
        if (isMounted) {
          setSuppliers(res.data);
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

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Quản lý Nhà cung cấp sản phẩm</h2>
        <div className="header-container">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
            className="add-btn"
          >
            Thêm Nhà cung cấp
          </Button>
        </div>
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
      </Row>
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
  );
};

export default Suppliers;
