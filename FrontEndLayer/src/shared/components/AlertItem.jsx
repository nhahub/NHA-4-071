import React from 'react';

// Simple placeholder AlertItem component
// Props: type (e.g., 'info', 'warning'), message
const AlertItem = ({ type = 'info', message = 'Alert message' }) => {
  const bgColor = type === 'warning' ? 'bg-[#FFB4AB]' : 'bg-[#1E2021]';
  const textColor = type === 'warning' ? 'text-[#BA1A1A]' : 'text-[#E2E2E3]';
  return (
    <div className={`${bgColor} rounded p-3 my-2`}>
      <p className={`${textColor} font-mono`}>{message}</p>
    </div>
  );
};

export default AlertItem;
