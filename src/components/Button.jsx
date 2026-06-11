import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ children, to, onClick, variant = 'primary', className = '' }) => {
  const baseStyles = 'inline-block text-center cursor-pointer';
  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline',
  };

  const styles = `${baseStyles} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={styles}>
      {children}
    </button>
  );
};

export default Button;
