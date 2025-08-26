import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from '../src/Context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AllProducts from './pages/admin/AllProducts';
import AllUsers from './pages/admin/users/AllUsers';
import { CreateProducts } from './pages/admin/CreateProducts';
import { EditProducts } from './pages/admin/EditProducts';
import { DeleteProducts } from './pages/admin/DeleteProducts';
import { EditUser } from './pages/admin/users/EditUser';
import { DeleteUsers } from './pages/admin/users/DeleteUsers';
// import { CreateUser } from './pages/admin/users/CreateUser';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route 
          path="/" 
          element={
            <CartProvider>
              <Home />
            </CartProvider>
          } 
        />
        <Route path="/login" element={<Login />} />

        {/* Rotas do painel admin */}
        <Route path="/admin" element={<Admin />}>
          {/* Rota padrão do admin - pode redirecionar para products ou dashboard */}
          <Route index element={<AllProducts />} />
          
          {/* Rotas de produtos */}
          <Route path="products" element={<AllProducts />} />
          <Route path="products/create" element={<CreateProducts />} />
          <Route path="products/edit" element={<EditProducts />} />
          <Route path="products/delete" element={<DeleteProducts />} />
          
          {/* Rotas de usuários */}
          <Route path="users" element={<AllUsers />} />
          {/* <Route path="users/create" element={<CreateUser />} /> */}
          <Route path="users/edit" element={<EditUser />} />
          <Route path="users/delete" element={<DeleteUsers />} />
        </Route>
        
        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </Router>
  );
};

export default App;