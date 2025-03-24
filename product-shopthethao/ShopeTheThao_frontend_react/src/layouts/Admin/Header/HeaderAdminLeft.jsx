import img from "assets/Img";
import { Link } from "react-router-dom";
import './HeaderLeft.scss';
import { m } from "framer-motion";
import { ADMIN_ROUTES } from "constants/routeConstants";

function HeaderAdminLeft({ collapsed }) {
  return (
    <div className="header-admin-left">
      {/* Brand Section - Logo & Name */}
      <Link 
        to={ADMIN_ROUTES.PORTAL}
        className="header-admin-left__brand"
        title="Dashboard Portal"
      >
        <div className="header-admin-left__brand-logo">
          {!collapsed && (
            <img
            style={{ width: '60px', height: '60px' , marginLeft: '10px', marginTop: '30px'}}
              src={img.logoAdmin}
              alt="Admin Dashboard"
              className="transition-all duration-300"
            />
          )}
        </div>
        
        <span className="header-admin-left__brand-name">
          Shope
        </span>
      </Link>

      {/* Divider between brand and admin info */}
      {!collapsed && (
        <div className="header-admin-left__divider hidden lg:block"></div>
      )}

      {/* Admin Information Section */}
      {!collapsed && (
        <div className="header-admin-left__admin-info hidden lg:block">
          nhdinh
        </div>
      )}
    </div>
  );
}

export default HeaderAdminLeft;
