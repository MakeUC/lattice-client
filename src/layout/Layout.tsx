import React from 'react';
import Providers from './Providers';
import Routes from './Routes';

const Layout = () => {
  return <>
    <Providers>
      <Routes />
    </Providers>
  </>;
};

export default Layout;