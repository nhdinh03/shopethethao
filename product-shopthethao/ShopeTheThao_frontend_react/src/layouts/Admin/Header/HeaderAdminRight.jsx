import { LogoutOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons";
import {
  faGear,
  faUser,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dropdown,
  Input,
  Avatar,
  Tooltip,
  message,
} from "antd";
import img from "assets/Img";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "components/Admin/Notifications/NotificationDropdown";
import authApi from "api/Admin/Auth/auth";

function HeaderAdminRight() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const userLocalData = authApi.getUserData().user;
    if (userLocalData) {
      setUserData(userLocalData);
      if (userLocalData.image) {
        const imgUrl = `http://localhost:8081/api/upload/${userLocalData.image}`;
        setImageUrl(imgUrl);
      }
    }
  }, []);
  const getImageUrl = (imageName) => {
    if (!imageName) return '';
    const url = `http://localhost:8081/api/upload/${imageName}`;
    return url;
  };

  const handleLogout = async () => {
    try {
      authApi.logout();
      navigate('/v1/auth/login');
      message.success("Đăng xuất thành công!");
    } catch (error) {
      message.error("Đăng xuất thất bại!");
    }
  };

  const changeLanguage = (lang) => {
    console.log(`Chuyển đổi ngôn ngữ sang: ${lang}`);
  };

  const settings = [
    {
      key: "1",
      label: (
        <span onClick={handleLogout} className="flex items-center gap-2">
          <LogoutOutlined /> Đăng xuất
        </span>
      )
    },
    {
      key: "2",
      label: (
        <a href="/admin/settings" className="flex items-center gap-2">
          <SettingOutlined /> Cài đặt tài khoản
        </a>
      )
    }
  ];
  
  // Common styling for language flag images
  const flagImageStyle = {
    width: "2.25rem",
    height: "1.25rem",
    borderRadius: "0.1px"
  };
  
  const languages = [
    {
      key: "vi",
      label: (
        <div onClick={() => changeLanguage("vi")} className="flex items-center gap-2">
          <img
            src={img.Co_VN}
            alt="Tiếng Việt"
            className="border"
            style={flagImageStyle}
          />
          <span>Tiếng Việt</span>
        </div>
      )
    },
    {
      key: "en",
      label: (
        <div onClick={() => changeLanguage("en")} className="flex items-center gap-2">
          <img
            src={img.Co_My}
            alt="English"
            className="border"
            style={flagImageStyle}
          />
          <span>English</span>
        </div>
      )
    }
  ];

  return (
 <div className="flex items-center justify-between w-full bg-white shadow-md px-6">
  {/* Thông tin người dùng */}
  <div className="flex items-center gap-4">
    {userData?.image && (
      <div className="debug-info" style={{ display: 'none' }}>
        <p>Image name: {userData.image}</p>
        <p>Full URL: {imageUrl}</p>
      </div>
    )}
    <Avatar
      src={userData?.image ? getImageUrl(userData.image) : ''}
      size="large"
      icon={!userData?.image && <FontAwesomeIcon icon={faUser} />}
    />
    <div className="flex flex-col text-center md:text-left">
      <span className="font-semibold text-gray-800 text-lg">
        {userData?.fullname || 'User'}
      </span>
      <span className="text-gray-500 text-sm">{userData?.id || 'Unknown ID'}</span>
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
  <div className="flex items-center gap-7">
    {/* Chuyển đổi ngôn ngữ */}
    <Dropdown
      menu={{ items: languages }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Tooltip>
        <img
          src={img.Co_VN}
          alt="Vietnam"
          className="w-9 h-6 rounded-full cursor-pointer border"
          style={{ borderRadius: "0.1px" }}
        />
      </Tooltip>
    </Dropdown>

    {/* Chuyển đổi chế độ sáng/tối */}
    {/* <Tooltip
      title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
    >
      <Switch
        checkedChildren={<FontAwesomeIcon icon={faSun} />}
        unCheckedChildren={<FontAwesomeIcon icon={faMoon} />}
        checked={isDarkMode}
        onChange={toggleDarkMode}
        className="text-lg"
      />
    </Tooltip> */}

    {/* Biểu tượng thành tích */}
    <Tooltip title="Thành tích">
      <span className="cursor-pointer text-gray-600 hover:text-blue-500">
        <FontAwesomeIcon icon={faTrophy} className="text-xl" />
      </span>
    </Tooltip>

    {/* Thông báo */}
    <NotificationDropdown />

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
