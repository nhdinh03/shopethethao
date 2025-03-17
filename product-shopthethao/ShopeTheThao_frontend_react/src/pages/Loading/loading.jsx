import { useState, useEffect } from 'react';
import './loading.scss';

const Loading = ({ timeout = 10000, message = "Đang tải..." }) => {
    const [isTimeout, setIsTimeout] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTimeout(true);
        }, timeout);

        return () => clearTimeout(timer);
    }, [timeout]);

    if (isTimeout) {
        return (
            <div className="loading-container error">
                <div className="loading-message">
                    <span>Không thể tải dữ liệu</span>
                    <p>Vui lòng thử lại sau</p>
                </div>
            </div>
        );
    }

    return (
        <div className="loading-container">
            <div className="loading-spinner">
                <div className="inner one"></div>
                <div className="inner two"></div>
                <div className="inner three"></div>
            </div>
            <div className="loading-message">
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Loading;