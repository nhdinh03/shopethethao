import { Link } from "react-router-dom";
import img from "../../../assets/Img";

function HeaderAdminLeft({ onClose }) {
  return (
    <div className="flex items-center gap-4">
      <Link to="/admin/index">
        {/* Logo Admin */}
        <div className="flex items-center gap-2">
          <img width={80} src={img.logoAdmin} alt="Admin Logo" />

          <div className="hidden lg:block text-4xl font-bold text-gray-900">
            Shope
          </div>
        </div>
      </Link>

      {/* Đường phân cách */}
      <div className="w-[1px] bg-gray-300 h-8 hidden lg:block"></div>

      {/* Nội dung thêm */}
      <div className="hidden lg:block text-lg font-semibold text-gray-700">
        nhdinh
      </div>
    </div>
  );
}

export default HeaderAdminLeft;
