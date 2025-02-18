import { useState, useEffect } from 'react';
import { message } from 'antd';
import sizeApi from 'api/Admin/Sizes/SizesApi';
import { SizeApi } from 'api/Admin';

export const useSizeManagement = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [size, setSize] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workSomeThing, setWorkSomeThing] = useState(false);

  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  useEffect(() => {
    let isMounted = true;
    const getList = async () => {
      setLoading(true);
      try {
        const res = await sizeApi.getByPage(currentPage, pageSize);
        if (isMounted) {
          setSize(res.data);
          setTotalItems(res.totalItems);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách sản phẩm. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    getList();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, workSomeThing]);

  const createSize = async (values) => {
    try {
      await sizeApi.create(values);
      message.success("Thêm kích thước thành công!");
      setWorkSomeThing(!workSomeThing);
      return true;
    } catch (error) {
      message.error("Lỗi khi lưu kích thước!");
      return false;
    }
  };

  const updateSize = async (id, values) => {
    try {
      await sizeApi.update(id, values);
      message.success("Cập nhật kích thước thành công!");
      setWorkSomeThing(!workSomeThing);
      return true;
    } catch (error) {
      message.error("Lỗi khi lưu kích thước!");
      return false;
    }
  };

  const deleteSize = async (id) => {
    try {
      await SizeApi.delete(id);
      message.success("Xóa kích thước thành công!");
      setWorkSomeThing(!workSomeThing);
      return true;
    } catch (error) {
      message.error("Không thể xóa kích thước!");
      return false;
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  return {
    size,
    loading,
    totalPages,
    currentPage,
    pageSize,
    setCurrentPage,
    handlePageSizeChange,
    createSize,
    updateSize,
    deleteSize
  };
};
