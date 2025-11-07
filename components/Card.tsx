
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, className }) => {
  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg ${className}`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-teal-300 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Card;
