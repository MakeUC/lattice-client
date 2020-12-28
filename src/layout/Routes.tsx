import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';
import Reset from '../pages/auth/Reset';
import Notifications from '../pages/notifications/Notifications';
import Profile from '../pages/profile/Profile';
import ChangeProfile from '../pages/profile/ChangeProfile';
import Home from '../pages/home/Home';
import AuthRoute from './AuthRoute';
import AppRoute from './AppRoute';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/auth/register/:registrantId">
          <AuthRoute>
            <Register />
          </AuthRoute>
        </Route>
        <Route path="/auth/login">
          <AuthRoute>
            <Login />
          </AuthRoute>
        </Route>
        <Route path="/auth/reset/:resetToken">
          <AuthRoute>
            <Reset />
          </AuthRoute>
        </Route>
        <Route path="/notifications">
          <AppRoute>
            <Notifications />
          </AppRoute>
        </Route>
        <Route path="/profile/edit">
          <AppRoute>
            <ChangeProfile />
          </AppRoute>
        </Route>
        <Route path="/profile">
          <AppRoute>
            <Profile />
          </AppRoute>
        </Route>
        <Route path="/">
          <AppRoute>
            <Home />
          </AppRoute>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;