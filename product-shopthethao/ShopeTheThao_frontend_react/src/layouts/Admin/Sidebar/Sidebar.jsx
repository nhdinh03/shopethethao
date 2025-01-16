import React from 'react';
import { Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function getItem(label, key, icon, children, type) {
    return { key, icon, children, label, type };
}

function Sidebar() {
    const isAuthenticated = !!localStorage.getItem('token'); // Kiểm tra đăng nhập

    if (!isAuthenticated) return null; // Nếu chưa đăng nhập, ẩn Sidebar

    const items = [
        getItem(<Link to="/admin/index">Trang chủ</Link>, 'home', <FontAwesomeIcon icon={solidIcons.faHouse} />),

        getItem('Rạp', 'grCinema', <FontAwesomeIcon icon={solidIcons.faTv} />, [
            getItem(<Link to="/admin/cinema-complex">Cụm rạp</Link>, 'cinemaComplex'),
            getItem(<Link to="/admin/cinema-type">Loại rạp</Link>, 'cinemaType'),
            getItem(<Link to="/admin/cinema-chains">Chuỗi Rạp</Link>, 'cinemaChains'),
        ]),

        getItem('Phim', 'grMovie', <FontAwesomeIcon icon={solidIcons.faVideo} />, [
            getItem(<Link to="/admin/movie">Phim</Link>, 'movie'),
            getItem(<Link to="/admin/movie-studio">Hãng phim</Link>, 'movieStudio'),
            getItem(<Link to="/admin/movie-producer">Nhà sản xuất</Link>, 'movieProducer'),
            getItem(<Link to="/admin/price">Giá vé</Link>, 'price'),
            getItem(<Link to="/admin/showtime">Suất chiếu</Link>, 'showtime'),
        ]),

        getItem('Ghế', 'grSeat', <FontAwesomeIcon icon={solidIcons.faCouch} />, [
            getItem(<Link to="/admin/seat">Ghế</Link>, 'seat'),
            getItem(<Link to="/admin/seat-type">Loại ghế</Link>, 'seatType'),
            getItem(<Link to="/admin/seat-chart">Sơ đồ ghế</Link>, 'seatChart'),
        ]),

        getItem('Thống kê', 'grStatic', <FontAwesomeIcon icon={solidIcons.faChartSimple} />, [
            getItem(<Link to="/admin/ticket-statistics">Thống kê vé</Link>, 'static'),
        ]),

        getItem('Dịch vụ & sự kiện', 'grServiceEvent', <FontAwesomeIcon icon={solidIcons.faCalendarCheck} />, [
            getItem(<Link to="/admin/combo">Combo</Link>, 'combo'),
            getItem(<Link to="/admin/service">Dịch vụ</Link>, 'service'),
            getItem(<Link to="/admin/priceService">Giá dịch vụ</Link>, 'priceService'),
            getItem('Sự kiện', 'grEvent', null, [
                getItem(<Link to="/admin/discount">Giảm giá</Link>, 'discount'),
                getItem(<Link to="/admin/event">Sự kiện</Link>, 'event'),
            ], 'group'),
        ]),

        { type: 'divider' },

        getItem(<Link to="/admin/account">Quản lý người dùng</Link>, 'grAccount', <FontAwesomeIcon icon={solidIcons.faUsers} />),
        getItem(<Link to="/admin/accountStaff">Quản lý nhân viên</Link>, 'grAccountStaff', <FontAwesomeIcon icon={solidIcons.faUserAlt} />),
        getItem(<Link to="/admin/comentModeration">Kiểm duyệt bình luận</Link>, 'grComentModeration', <FontAwesomeIcon icon={solidIcons.faComment} />),
        getItem(<Link to="/admin/webcam">Soát vé</Link>, 'webcam', <FontAwesomeIcon icon={solidIcons.faCamera} />),
        getItem(<Link to="/admin/sendEmail">Gửi Email</Link>, 'sendEmail', <FontAwesomeIcon icon={solidIcons.faEnvelope} />),
    ];

    return <Menu mode="inline" items={items} />;
}

export default Sidebar;
