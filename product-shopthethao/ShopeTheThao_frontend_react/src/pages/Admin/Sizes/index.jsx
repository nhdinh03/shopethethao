import React, { useEffect, useState } from "react";
import { Button, Form, message, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import sizeApi from "api/Admin/Sizes/SizesApi";
import { SizeApi } from "api/Admin";

import "./size.scss";
import { SizeModal, SizePagination, SizeTable } from "components/Admin";

const Sizes = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;
  const [size, setSize] = useState([]);
  const [open, setOpen] = useState(false);
  const [editSize, setEditSize] = useState(null);
  const [workSomeThing, setWorkSomeThing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await sizeApi.getByPage(currentPage, pageSize);
        if (isMounted) {
          setSize(res.data);
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
      if (editSize) {
        await sizeApi.update(editSize.id, values);
        message.success("Cập nhật kích thước thành công!");
      } else {
        await sizeApi.create(values);
        message.success("Thêm kích thước thành công!");
      }
      setOpen(false);
      form.resetFields();
      setEditSize(null);
      setWorkSomeThing(!workSomeThing);
    } catch (error) {
      message.error("Lỗi khi lưu kích thước!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await SizeApi.delete(id);
      message.success("Xóa kích thước thành công!");
      setWorkSomeThing(!workSomeThing); // Update list
    } catch (error) {
      message.error("Không thể xóa kích thước!");
    }
  };
  const handleEditData = (category) => {
    setEditSize(category);
    form.setFieldsValue(category);
    setOpen(true);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: 10 }}>
      <Row>
        <h2>Quản lý kích thước sản phẩm</h2>
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

      <SizeModal
        form={form}
        open={open}
        handleModalOk={handleModalOk}
        handleResetForm={() => form.resetFields()}
        handleCancel={() => setOpen(false)}
        editSize={editSize}
      />

      <SizeTable
        sizeData={size}
        handleEditData={handleEditData}
        handleDelete={handleDelete}
        loading={loading}
      />

      <SizePagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default Sizes;
