import React from 'react';

// Simple placeholder SessionCard component
// Props can be extended as needed for actual session data.
const SessionCard = ({ title = 'Session Title', description = 'Session description', time = 'Now' }) => {
  return (
    <div className="bg-[#1E2021] rounded-lg p-4 shadow-md">
      <h3 className="font-mono text-base text-[#E2E2E3] mb-2">{title}</h3>
      <p className="text-sm text-[#D0C5B2] mb-1">{description}</p>
      <span className="text-xs text-[#A0A0A0]">{time}</span>
    </div>
  );
};

export default SessionCard;
