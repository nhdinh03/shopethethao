import { useState, useEffect } from 'react';
import { message } from 'antd';
import { rolesApi } from 'api/Admin';

export const useRolesManagement = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workSomeThing, setWorkSomeThing] = useState(false);
  
  
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  useEffect(() => {
    let isMounted = true;
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const res = await rolesApi.getByPage(currentPage, pageSize, searchText);
        if (isMounted) {
          setRoles(res.data);
          setTotalItems(res.totalItems);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách vai trò. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, searchText ,workSomeThing]);

  const createRole = async (values) => {
    try {
      await rolesApi.create(values);
      message.success("Thêm vai trò thành công!");
      setWorkSomeThing(!workSomeThing);
      return true;
    } catch (error) {
      message.error("Lỗi khi thêm vai trò!");
      return false;
    }
  };

  const updateRole = async (id, values) => {
    try {
      await rolesApi.update(id, values);
      message.success("Cập nhật vai trò thành công!");
      setWorkSomeThing(!workSomeThing);
      return true;
    } catch (error) {
      message.error("Lỗi khi cập nhật vai trò!");
      return false;
    }
  };

  const deleteRole = async (id) => {
    try {
      await rolesApi.delete(id);
      message.success("Xóa vai trò thành công!");
      setWorkSomeThing(!workSomeThing);
      return true;
    } catch (error) {
      message.error("Không thể xóa vai trò!");
      return false;
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  return {
    roles,
    loading,
    totalPages,
    currentPage,
    pageSize,
    searchText,
    setSearchText,
    setCurrentPage,
    handlePageSizeChange,
    createRole,
    updateRole,
    deleteRole
  };
};
