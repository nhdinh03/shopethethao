import { Spin } from 'antd';
import './loading.scss';

const Loading = () => {
    return (
        <div className="loading-container">
            <Spin size="large" />
        </div>
    );
};

export default Loading;
