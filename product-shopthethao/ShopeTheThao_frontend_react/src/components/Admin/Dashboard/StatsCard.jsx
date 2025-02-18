import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const StatsCard = ({ title, value, weeklyChange, dailyChange, valueColor }) => {
  return (
    <div className="bg-white shadow-xl transform transition-transform hover:scale-105 p-6 rounded-md">
      <h3 className="text-sm font-bold text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold text-${valueColor}-500`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
        {title.includes('VND') && ' VND'}
      </p>
      <p className="text-sm flex items-center">
        <FontAwesomeIcon icon={faArrowUp} className="text-green-500 mr-1" />
        <span className="text-green-500">{weeklyChange}% Tuần</span>
      </p>
      <p className="text-sm flex items-center">
        <FontAwesomeIcon icon={faArrowDown} className="text-red-500 mr-1" />
        <span className="text-red-500">{dailyChange}% Ngày</span>
      </p>
    </div>
  );
};

export default StatsCard;
