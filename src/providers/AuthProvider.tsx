import React, { createContext, useContext, useState, useEffect } from 'react';
import { WrapperComponent } from '../interfaces/wrapper';
import AuthService from '../services/AuthService';
import PushService from '../services/PushService';

interface contextType { 
  token: string | null
  getRegistrantEmail: (registrantId: string) => Promise<string>
  register: (registrantId: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
  sendResetLink: (email: string) => Promise<void>
  getResetInfo: (resetToken: string) => Promise<any>
  resetPassword: (resetToken: string, password: string) => Promise<void>
}

const tokenStorageKey = `lattice-token`;
const subscriptionStorageKey = `push-subscription-id`;

const context = createContext<contextType | null>(null);

export const AuthProvider: WrapperComponent = ({ children }) => {
  const [ token, setToken ] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(tokenStorageKey);
    setToken(token);
  }, []);

  useEffect(() => {
    (async function() {
      try {
        if(!token) return;

        const id = localStorage.getItem(subscriptionStorageKey);
        if(id) return;

        const subscription = await PushService.subscribe(token);
        localStorage.setItem(subscriptionStorageKey, subscription.id);
      } catch(err) {
        console.error(err);
      }
    })();
  }, [ token ]);

  const getRegistrantEmail = (registrantId: string) => AuthService.getRegistrantEmail(registrantId);

  const register = async (registrantId: string, password: string) => {
    const token = await AuthService.register(registrantId, password);
    localStorage.setItem(tokenStorageKey, token);
    setToken(token);
  };

  const login = async (email: string, password: string) => {
    const token = await AuthService.login(email, password);
    localStorage.setItem(tokenStorageKey, token);
    setToken(token);
  };

  const logout = async () => {
    try {
      localStorage.removeItem(tokenStorageKey);
      setToken(null);

      const id = localStorage.getItem(subscriptionStorageKey);
      await PushService.unsubscribe(token!, id!);
      localStorage.removeItem(subscriptionStorageKey);
    } catch(err) {
      console.error(err);
    }
  };

  const changePassword = (oldPassword: string, newPassword: string) =>
    AuthService.changePassword(token!, oldPassword, newPassword);

  const sendResetLink = (email: string) => AuthService.sendResetLink(email);

  const getResetInfo = (resetToken: string) => AuthService.getResetInfo(resetToken);

  const resetPassword = (resetToken: string, password: string) => AuthService.resetPassword(resetToken, password);

  const contextValue: contextType = {
    token, getRegistrantEmail, register, login,
    logout, changePassword, sendResetLink, getResetInfo, resetPassword
  };

  return <context.Provider value={contextValue}>{children}</context.Provider>;
};

export const useAuth = () => useContext(context)!;
