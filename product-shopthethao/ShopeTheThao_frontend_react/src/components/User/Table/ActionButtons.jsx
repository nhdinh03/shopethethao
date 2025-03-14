import React from 'react';

const ActionButtons = ({ actions }) => {
  return (
    <div className="flex space-x-2">
      {actions.map((action, index) => (
        <button
          key={`${action.label}-${index}`}
          onClick={action.onClick}
          className={action.className}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
