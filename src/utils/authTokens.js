import axios from "axios";

const USER_TOKEN_KEY = "auth_token";
const SELLER_TOKEN_KEY = "seller_auth_token";

export const saveUserToken = (token) => {
  localStorage.setItem(USER_TOKEN_KEY, token);
};

export const saveSellerToken = (token) => {
  localStorage.setItem(SELLER_TOKEN_KEY, token);
};

export const clearUserToken = () => {
  localStorage.removeItem(USER_TOKEN_KEY);
};

export const clearSellerToken = () => {
  localStorage.removeItem(SELLER_TOKEN_KEY);
};

axios.interceptors.request.use((config) => {
  const userToken = localStorage.getItem(USER_TOKEN_KEY);
  const sellerToken = localStorage.getItem(SELLER_TOKEN_KEY);

  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }
  if (sellerToken) {
    config.headers["X-Seller-Token"] = sellerToken;
  }

  return config;
});
