import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import './BreadcrumbUser.scss';

const BreadcrumbUser = ({ items }) => {
  const location = useLocation();

  return (
    <div className="breadcrumb-user-container">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined className="home-icon" />
            Trang chủ
          </Link>
        </Breadcrumb.Item>
        {items?.map((item, index) => (
          <Breadcrumb.Item key={index}>
            {item.path ? (
              <Link to={item.path}>{item.title}</Link>
            ) : (
              item.title
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbUser;
