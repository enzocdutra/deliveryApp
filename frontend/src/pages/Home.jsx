import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import CartModal from '../components/CartModal';
import Footer from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartContext } from '../Context/CartContext'; // ajuste o caminho se precisar
import { useStoreStatus } from '../hooks/useStoreStatus';
import { getClosedStoreMessage } from '../lib/store-hours';

const Home = () => {
  const { cart, addItemToCart, setCart } = useContext(CartContext);
  const [isCartOpen, setCartOpen] = useState(false);
  const { storeOpen, statusMessage } = useStoreStatus();

  useEffect(() => {
    console.log("Carrinho atualizado (contexto):", cart);
  }, [cart]);

  const addToCart = (itemData) => {
    if (!storeOpen) {
      toast.error(getClosedStoreMessage(), {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    addItemToCart(itemData); // Aqui chama diretamente o contexto
    return true;
  };

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.finalPrice, 0);

  return (
    <div className='w-full min-h-screen bg-stone-950'>
      <Header storeOpen={storeOpen} statusMessage={statusMessage} />
      <Menu onAddToCart={addToCart} storeOpen={storeOpen} statusMessage={statusMessage} />
      <CartModal
        isOpen={isCartOpen}
        onClose={closeCart}
        cart={cart}
        setCart={setCart}
        storeOpen={storeOpen}
      />
      <ToastContainer />
      <div className='bg-stone-100'>
      <Footer onCartClick={openCart} cartCount={cartCount} totalPrice={totalPrice} isCartOpen={isCartOpen} storeOpen={storeOpen} />
      </div>
    </div>
  );
};

export default Home;
