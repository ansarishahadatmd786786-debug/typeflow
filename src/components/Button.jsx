import React from 'react';

const variants = {
  primary: 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm shadow-indigo-500/20',
  secondary: 'bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10',
  ghost: 'hover:bg-white/10 text-gray-400 hover:text-gray-200',
  danger: 'bg-red-500/90 hover:bg-red-600 text-white shadow-sm',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm',
  outline: 'border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        active:scale-95
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
