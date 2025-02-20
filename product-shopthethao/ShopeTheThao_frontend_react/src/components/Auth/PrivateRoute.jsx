import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  let user = null; // Biến lưu trữ thông tin người dùng, mặc định là null
  
  try {
    // Lấy thông tin người dùng từ localStorage
    const userString = localStorage.getItem('user');
    console.log('Dữ liệu người dùng từ localStorage:', userString);
    
    // Nếu có dữ liệu, chuyển đổi từ chuỗi JSON thành object
    if (userString) {
      user = JSON.parse(userString);
      console.log('Dữ liệu người dùng đã được phân tích:', user);
      console.log('Danh sách quyền hạn của người dùng:', user.roles);

      // Kiểm tra nếu user có vai trò ADMIN trong danh sách roles
      if (user.roles && Array.isArray(user.roles) && user.roles.includes('ADMIN')) {
        console.log('Truy cập được cấp - Người dùng là quản trị viên');
        return children; // Trả về nội dung (component) 
      }
    }

    console.warn('Truy cập bị từ chối - Người dùng không phải là quản trị viên');
    return <Navigate to="/login" replace />;
    
  } catch (error) {
    console.error('Lỗi khi xử lý dữ liệu người dùng:', error);
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
