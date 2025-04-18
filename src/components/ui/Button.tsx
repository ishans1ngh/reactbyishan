import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'relative px-6 py-3 rounded-lg font-medium transition-all duration-300 text-sm transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0';
  
  const variantClasses = {
    primary: 'bg-blue-900 text-white shadow-lg hover:shadow-blue-900/30 focus:ring-blue-500',
    secondary: 'bg-emerald-600 text-white shadow-lg hover:shadow-emerald-600/30 focus:ring-emerald-500',
    outline: 'bg-transparent border border-blue-900 text-blue-900 hover:bg-blue-50 focus:ring-blue-500',
    danger: 'bg-red-600 text-white shadow-lg hover:shadow-red-600/30 focus:ring-red-500',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="absolute inset-0 transform scale-x-0 origin-left transition duration-300 ease-out bg-opacity-20 group-hover:scale-x-100"></div>
      </div>
    </button>
  );
};

export default Button;