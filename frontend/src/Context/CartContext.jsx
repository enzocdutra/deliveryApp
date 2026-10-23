// CartContext.jsx
import React, { createContext, useState } from 'react';
import { isStoreOpen } from '../lib/store-hours';
import { flavorKey, hasValidRodizioFlavors } from '../lib/rodizio';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addItemToCart = (item) => {
    if (!isStoreOpen() || !hasValidRodizioFlavors(item)) {
      return false;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(
        i => i.name === item.name &&
             i.extrasTotal === item.extrasTotal &&
             i.comments === item.comments &&
             flavorKey(i) === flavorKey(item)
      );
      if (existingItem) {
        return prevCart.map(i => 
          i.name === item.name &&
          i.extrasTotal === item.extrasTotal &&
          i.comments === item.comments &&
          flavorKey(i) === flavorKey(item)
            ? { ...i, quantity: i.quantity + item.quantity, finalPrice: i.finalPrice + item.finalPrice }
            : i
        );
      }
      return [...prevCart, item];
    });

    return true;
  };

  // ✅ Adicione essa função, caso não exista:
  const removeItemFromCart = (name, extrasTotal, comments, flavors = []) => {
    setCart((prevCart) => prevCart.filter(
      (item) => !(item.name === name && item.extrasTotal === extrasTotal && item.comments === comments
        && flavorKey(item) === flavorKey({ flavors }))
    ));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, setCart, addItemToCart, removeItemFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
