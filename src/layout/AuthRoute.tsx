import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import { Redirect } from 'react-router-dom';
import { WrapperComponent } from '../interfaces/wrapper';
import Wave from '../components/Wave';

const AuthRoute: WrapperComponent = ({ children }) => {
  const { token } = useAuth();

  if(token) return <Redirect to="/" />

  return <>{children}<Wave /></>;
};

export default AuthRoute;