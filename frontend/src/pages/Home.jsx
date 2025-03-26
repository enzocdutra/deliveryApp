import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import CartModal from '../components/CartModal';
import Footer from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartContext } from '../Context/CartContext'; // ajuste o caminho se precisar

const checkRestaurantOpen = () => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = 19 * 60;
  const closeMinutes = 22 * 60 + 30;
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

const Home = () => {
  const { cart, addItemToCart, setCart } = useContext(CartContext);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    console.log("Carrinho atualizado (contexto):", cart);
  }, [cart]);

  const addToCart = (itemData) => {
    if (!checkRestaurantOpen()) {
      toast.error("Infelizmente estamos fechado", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    addItemToCart(itemData); // Aqui chama diretamente o contexto
  };

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div>
      <Header />
      <Menu onAddToCart={addToCart} />
      <CartModal
        isOpen={isCartOpen}
        onClose={closeCart}
        cart={cart}
        setCart={setCart}
      />
      <Footer onCartClick={openCart} cartCount={cartCount} />
      <ToastContainer />
    </div>
  );
};

export default Home;
