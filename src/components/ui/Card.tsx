import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: '3d' | 'flat' | 'glass';
}

const Card: React.FC<CardProps> = ({ children, className = '', variant = 'flat' }) => {
  const baseClasses = 'rounded-xl p-6 transition-all duration-300';
  
  const variantClasses = {
    '3d': 'bg-white relative transform hover:-translate-y-2 shadow-xl hover:shadow-2xl before:absolute before:inset-0 before:-z-10 before:translate-x-2 before:translate-y-2 before:bg-blue-100 before:rounded-xl',
    'flat': 'bg-white shadow-lg',
    'glass': 'bg-white/70 backdrop-blur-md shadow-lg border border-white/20',
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;