import { SearchOutlined } from "@ant-design/icons";
import {
  faBell,
  faGear,
  faRightFromBracket,
  faUser,
  faTrophy,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dropdown,
  Input,
  Popconfirm,
  Avatar,
  Tooltip,
  Badge,
  Switch,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../../assets/Img";
import { useDarkMode } from "../../..//config/DarkModeProvider";

function HeaderAdminRight() {
  const [userData, setUserData] = useState(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = {
          fullname: "Nguyễn Văn A",
          avatar: "https://i.pravatar.cc/150",
          position: "CEO",
        };
        setUserData(user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const changeLanguage = (lang) => {
    console.log(`Chuyển đổi ngôn ngữ sang: ${lang}`);
  };

  const notifications = [
    { key: "1", label: <a href="#notification-1">Bạn có 3 nhiệm vụ mới</a> },
    { key: "2", label: <a href="#notification-2">Báo cáo doanh thu tháng</a> },
    {
      key: "3",
      label: <a href="#notification-3">Cập nhật hệ thống thành công</a>,
    },
  ];

  const settings = [
    { key: "1", label: <span onClick={handleLogout}>Đăng xuất</span> },
    { key: "2", label: <a href="/admin/settings">Cài đặt tài khoản</a> },
  ];

  const languages = [
    {
      key: "vi",
      label: (
        <div onClick={() => changeLanguage("vi")}>
          <img
            src={img.Co_VN}
            alt="Language"
            className="w-9 h-5 rounded-full"
            style={{ borderRadius: "0.1px" }}
          />
          Tiếng Việt
        </div>
      ),
    },
    {
      key: "en",
      label: (
        <div onClick={() => changeLanguage("en")}>
          <img
            src={img.Co_My}
            alt="English"
            className="w-9 h-5 rounded-full"
            style={{ borderRadius: "0.1px" }}
          />
          English
        </div>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-between w-full bg-white shadow-md px-6">
      {/* Thông tin người dùng */}
      <div className="flex items-center gap-4">
        <Avatar
          src={userData?.avatar}
          size="large"
          icon={<FontAwesomeIcon icon={faUser} />}
        />
        <div className="flex flex-col text-center md:text-left">
          <span className="font-semibold text-gray-800 text-lg">
            {userData?.fullname}
          </span>
          <span className="text-gray-500 text-sm">{userData?.position}</span>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex flex-1 justify-center px-4">
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined />}
          className="w-full max-w-[400px] rounded-full shadow-sm"
        />
      </div>

      {/* Các nút điều khiển */}
      <div className="flex items-center gap-4">
        {/* Chuyển đổi ngôn ngữ */}
        <Dropdown
          menu={{ items: languages }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Tooltip title="Chuyển đổi ngôn ngữ">
            <img
              src={img.Co_VN}
              alt="Vietnam"
              className="w-9 h-6 rounded-full cursor-pointer border"
              style={{ borderRadius: "0.1px" }}
            />
          </Tooltip>
        </Dropdown>

        {/* Chuyển đổi chế độ sáng/tối */}
        <Tooltip
          title={
            isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
          }
        >
          <Switch
            checkedChildren={<FontAwesomeIcon icon={faSun} />}
            unCheckedChildren={<FontAwesomeIcon icon={faMoon} />}
            checked={isDarkMode}
            onChange={toggleDarkMode}
            className="text-lg"
          />
        </Tooltip>

        {/* Biểu tượng thành tích */}
        <Tooltip title="Thành tích">
          <span className="cursor-pointer text-gray-600 hover:text-blue-500">
            <FontAwesomeIcon icon={faTrophy} className="text-xl" />
          </span>
        </Tooltip>

        {/* Nút thông báo */}
        <Dropdown
          menu={{ items: notifications }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Badge count={3} size="small">
            <span className="cursor-pointer text-gray-600 hover:text-blue-500">
              <FontAwesomeIcon icon={faBell} className="text-xl" />
            </span>
          </Badge>
        </Dropdown>

        {/* Nút cài đặt */}
        <Dropdown
          menu={{ items: settings }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <span className="cursor-pointer text-gray-600 hover:text-blue-500">
            <FontAwesomeIcon icon={faGear} className="text-xl" />
          </span>
        </Dropdown>
      </div>
    </div>
  );
}

export default HeaderAdminRight;
