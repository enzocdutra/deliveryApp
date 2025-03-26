import React from 'react';
import { CartProvider } from '../src/Context/CartContext';
import Home from './pages/Home';

const App = () => {
  return (
    <CartProvider>
      <Home />
    </CartProvider>
  );
};

export default App;
