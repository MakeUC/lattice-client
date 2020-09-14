import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import PushService from '../services/PushService';

const tokenStorageKey = `lattice-token`;

const context = createContext({ 
  token: ``, 
  email: ``, 
  getRegistrantEmail() {}, 
  register() {},
  login() {},
  logout() {}
});

export function AuthProvider({ children }) {
  const [ token, setToken ] = useState(``);

  useEffect(() => {
    const token = localStorage.getItem(tokenStorageKey);
    setToken(token);
  }, []);

  useEffect(() => {
    (async function() {
      try {
        token && await PushService.createSubscription(token);
      } catch(err) {
        console.error(err);
      }
    })();
  }, [ token ]);

  const getRegistrantEmail = registrantId => AuthService.getRegistrantEmail(registrantId);

  const register = async (registrantId, password) => {
    const token = await AuthService.register(registrantId, password);
    localStorage.setItem(tokenStorageKey, token);
    setToken(token);
  };

  const login = async (email, password) => {
    const token = await AuthService.login(email, password);
    localStorage.setItem(tokenStorageKey, token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem(tokenStorageKey);
    setToken(null);
  };

  const contextValue = {
    token, getRegistrantEmail, register, login, logout
  };

  return <context.Provider value={contextValue}>{children}</context.Provider>;
};

export const useAuth = () => useContext(context);
