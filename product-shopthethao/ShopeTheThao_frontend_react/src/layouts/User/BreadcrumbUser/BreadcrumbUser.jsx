import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import './BreadcrumbUser.scss';
import { breadcrumbDataUser } from './BreadcrumbUserConfig';

const BreadcrumbUser = ({ extraData, modern, withBackground = true }) => {
  const location = useLocation();

  // Build breadcrumb items based on current path
  const buildItems = () => {
    const items = [];
    
    // Always add home first
    items.push({
      title: (
        <Link to="/">
          <HomeOutlined className="home-icon" /> {breadcrumbDataUser[0].title}
        </Link>
      )
    });

    // Find matching breadcrumb path
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);

    if (pathParts.length > 0) {
      // Handle seefulldetails specially for product name
      if (pathParts[0] === 'v1/shop/seefulldetails') {
        // Add Products link
        items.push({
          title: <Link to="/products">{breadcrumbDataUser[1].title}</Link>
        });

        // Add product name or fallback
        if (extraData?.product) {
          items.push({
            title: extraData.product.name
          });
        } else {
          items.push({
            title: breadcrumbDataUser[2].title
          });
        }
      } else {
        // For other pages, find matching path from config
        const matchingPath = breadcrumbDataUser.find(item => 
          item.url === `/${pathParts[0]}`
        );

        if (matchingPath) {
          items.push({
            title: matchingPath.title
          });
        }
      }
    }

    return items;
  };

  return (
    <div className={`breadcrumb-user-container ${!withBackground ? 'transparent-bg' : ''} ${modern ? 'modern' : ''}`}>
      <Breadcrumb items={buildItems()} />
    </div>
  );
};

export default BreadcrumbUser;