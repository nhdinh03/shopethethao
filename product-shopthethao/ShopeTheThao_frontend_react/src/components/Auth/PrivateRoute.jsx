import UserNotFound from 'pages/NotFound/UserNotFound';
import { Navigate } from 'react-router-dom';


const PrivateRoute = ({ children }) => {
    try {
        const userString = localStorage.getItem('user');
        if (!userString) {
            return <Navigate to="/login" replace />;
        }

        const user = JSON.parse(userString);
        
        if (user.roles && Array.isArray(user.roles) && user.roles.includes('ADMIN')) {
            return children;
        }

        return <UserNotFound />;
        
    } catch (error) {
        console.error('Lỗi xác thực:', error);
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;
