// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./Context/CartContext";

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Painel admin
import Admin from "./pages/Admin";
import AllProducts from "./pages/admin/AllProducts";
import { CreateProducts } from "./pages/admin/CreateProducts";

// Proteção de rotas
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route
          path="/"
          element={
            <CartProvider>
              <Home />
            </CartProvider>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas protegidas - painel admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        >
          {/* Rota padrão do admin */}
          <Route index element={<AllProducts />} />

          {/* Rotas de produtos */}
          <Route path="products" element={<AllProducts />} />
          <Route path="products/create" element={<CreateProducts />} />
        </Route>

        {/* Fallback - página não encontrada */}
        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
