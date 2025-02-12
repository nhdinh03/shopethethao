import React from 'react';
import { Table } from 'antd';

const CategoryTable = ({ categories, loading, columns }) => {
  return (
    <div className="table-container">
      <Table
        pagination={false}
        columns={columns}
        loading={loading}
        scroll={{ x: 'max-content' }}
        dataSource={categories.map((categorie) => ({
          ...categorie,
          key: categorie.id,
        }))}
      />
    </div>
  );
};

export default CategoryTable;
