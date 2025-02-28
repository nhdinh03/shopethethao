import { useState, useEffect } from 'react';
import { message } from 'antd';
import { invoicesApi } from 'api/Admin';

export const useInvoiceManagement = () => {
  const [invoices, setInvoices] = useState({
    pending: [],
    shipping: [],
    delivered: [],
    cancelled: []
  });
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await invoicesApi.getAll();
      const data = response.data;
      
      setInvoices({
        pending: data.filter(invoice => invoice.status === "PENDING"),
        shipping: data.filter(invoice => invoice.status === "SHIPPING"), 
        delivered: data.filter(invoice => invoice.status === "DELIVERED"),
        cancelled: data.filter(invoice => invoice.status === "CANCELLED")
      });
    } catch (error) {
      message.error("Không thể lấy danh sách hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (invoiceId, status, options = {}) => {
    try {
      const numericId = parseInt(invoiceId.replace("#", ""));
      if (!numericId) throw new Error("ID hóa đơn không hợp lệ!");

      await invoicesApi.updateStatus(numericId, {
        status,
        ...options
      });
      
      message.success("Cập nhật trạng thái thành công!");
      await fetchInvoices();
      return true;
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại: " + error.message);
      return false;
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    fetchInvoices,
    updateInvoiceStatus
  };
};
