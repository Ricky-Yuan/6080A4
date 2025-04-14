import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  onClick, 
  variant = 'primary',
  className = '',
  disabled = false
}) => {
  const baseStyles = 'px-4 py-2 rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 disabled:opacity-50';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
