import { useState, useEffect } from 'react';
import { message } from 'antd';
import verifications from 'api/Admin/Verifications/verificationsApi';

export const useVerificationsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;

  useEffect(() => {
    let isMounted = true;
    const fetchVerifications = async () => {
      setLoading(true);
      try {
        const res = await verifications.getByPage(currentPage, pageSize, searchText);
        if (isMounted) {
          setData(res.data);
          setTotalItems(res.totalItems);
        }
      } catch (error) {
        message.error("Không thể lấy danh sách tài khoản. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    fetchVerifications();
    return () => { isMounted = false; };
  }, [currentPage, pageSize, searchText]);

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  return {
    data,
    loading,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    searchText,
    setSearchText,
    setCurrentPage,
    handlePageSizeChange
  };
};
