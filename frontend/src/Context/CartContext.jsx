// CartContext.jsx
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addItemToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        i => i.name === item.name &&
             i.extrasTotal === item.extrasTotal &&
             i.comments === item.comments
      );
      if (existingItem) {
        return prevCart.map(i => 
          i.name === item.name &&
          i.extrasTotal === item.extrasTotal &&
          i.comments === item.comments
            ? { ...i, quantity: i.quantity + item.quantity, finalPrice: i.finalPrice + item.finalPrice }
            : i
        );
      }
      return [...prevCart, item];
    });
  };

  // ✅ Adicione essa função, caso não exista:
  const removeItemFromCart = (name, extrasTotal, comments) => {
    setCart((prevCart) => prevCart.filter(
      (item) => !(item.name === name && item.extrasTotal === extrasTotal && item.comments === comments)
    ));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, setCart, addItemToCart, removeItemFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
