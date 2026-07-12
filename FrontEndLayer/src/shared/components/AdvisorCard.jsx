import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// Minimal Advisor card using the project's design tokens
const AdvisorCard = ({ advisor }) => {
  const { name, email, departmentId } = advisor;
  return (
    <div
      className="flex flex-col p-5 gap-3 rounded-lg"
      style={{
        background: 'var(--color-dashboard-card)',
        borderLeft: '4px solid var(--color-gold)',
      }}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-mono text-base text-[#E2E2E3]">{name}</h3>
        <ArrowUpRight size={16} className="text-[#E7C365]" />
      </div>
      <p className="font-inter text-sm text-[#D0C5B2]">{email}</p>
      <span className="font-inter text-xs text-[#A0A0A0]">
        Department: {departmentId}
      </span>
    </div>
  );
};

export default AdvisorCard;
