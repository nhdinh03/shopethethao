import React from 'react';
import BaseTables from './BaseTable.module.scss';
import { Table } from 'antd';
import classNames from 'classnames';

const cx = classNames.bind(BaseTables);

const BaseTable = (props) => {
    return <Table {...props} className={cx('table')} />;
};

export default BaseTable;
