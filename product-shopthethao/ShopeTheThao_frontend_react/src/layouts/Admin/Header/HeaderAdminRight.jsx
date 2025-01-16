import { SearchOutlined } from '@ant-design/icons';
import { faBell, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, Input, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeaderAdminRight() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data (mocked for now)
                const user = { fullname: 'Nguyễn Văn A' }; // Thay bằng API thực tế
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
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const notifications = [
        {
            key: '1',
            label: <a href="#notification-1">Thông báo 1</a>,
        },
        {
            key: '2',
            label: <a href="#notification-2">Thông báo 2</a>,
        },
        {
            key: '3',
            label: <a href="#notification-3">Thông báo 3</a>,
        },
    ];

    const settings = [
        {
            key: '1',
            label: <span onClick={handleLogout}>Đăng xuất</span>,
        },
    ];

    return (
        <div className="flex items-center justify-between w-full bg-white shadow-md px-6">
            {/* Tên người dùng */}
            <div className="text-gray-600 text-base">
                Xin chào,{' '}
                <span className="font-semibold text-gray-800 text-lg">
                    {userData?.fullname ? userData.fullname.split(' ').pop() : ''}
                </span>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="flex items-center w-1/3 max-w-md">
                <Input
                    placeholder="Tìm kiếm..."
                    prefix={<SearchOutlined />}
                    className="w-full rounded-full shadow-sm"
                />
            </div>

            {/* Các nút điều khiển */}
            <div className="flex items-center gap-6">
                {/* Nút thông báo */}
                <Dropdown
                    menu={{ items: notifications }}
                    placement="bottomRight"
                    trigger={['click']}
                >
                    <span className="cursor-pointer text-gray-600 hover:text-blue-500">
                        <FontAwesomeIcon icon={faBell} className="text-xl" />
                    </span>
                </Dropdown>

                {/* Nút cài đặt */}
                <Dropdown
                    menu={{ items: settings }}
                    placement="bottomRight"
                    trigger={['click']}
                >
                    <span className="cursor-pointer text-gray-600 hover:text-blue-500">
                        <FontAwesomeIcon icon={faGear} className="text-xl" />
                    </span>
                </Dropdown>

                {/* Nút đăng xuất */}
                <Popconfirm
                    title="Đăng xuất"
                    description="Bạn có chắc chắn muốn đăng xuất?"
                    onConfirm={handleLogout}
                    okText="Có"
                    cancelText="Không"
                >
                    <span className="cursor-pointer text-gray-600 hover:text-red-500">
                        <FontAwesomeIcon icon={faRightFromBracket} className="text-xl" />
                    </span>
                </Popconfirm>
            </div>
        </div>
    );
}

export default HeaderAdminRight;
