import axios from "axios";

// URL do backend
const API_URL = " https://fence-email-motorola-portland.trycloudflare.com";

// Função para pegar o token salvo
const getToken = () => localStorage.getItem("token");

// ================== AUTH ==================

// Registrar usuário
export const registerUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { username, password });
  return response.data;
};

// Login
export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  return response.data; // { token }
};
// verificar token
export const verifyToken = async (token) => {
  const res = await axios.get(`${API_URL}/auth/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
// ================== PRODUTOS ==================

// Listar produtos
export const getProdutos = async () => {
  const response = await axios.get(`${API_URL}/produtos/`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Buscar produto por ID
export const getProduto = async (id) => {
  const response = await axios.get(`${API_URL}/produtos/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Criar produto - CORRIGIDO (removido /create)
export const createProduto = async (produto) => {
  const response = await axios.post(`${API_URL}/produtos/`, produto, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Atualizar produto - CORRIGIDO (mantido igual, está correto)
export const updateProduto = async (id, produto) => {
  const response = await axios.put(`${API_URL}/produtos/${id}`, produto, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Deletar produto - CORRIGIDO (mantido igual, está correto)
export const deleteProduto = async (id) => {
  const response = await axios.delete(`${API_URL}/produtos/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Listar produtos por categoria - CORRIGIDO (ajustado o path)
export const getProdutosByCategoria = async (categoria) => {
  const response = await axios.get(`${API_URL}/produtos/categoria/${categoria}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};
