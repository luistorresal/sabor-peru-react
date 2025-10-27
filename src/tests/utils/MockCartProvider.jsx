// src/tests/utils/MockCartProvider.jsx
import React from 'react';
import { CartContext } from '../../context/CartContext';

const MockCartProvider = ({ children, cartValue }) => {
  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
};

export default MockCartProvider;
