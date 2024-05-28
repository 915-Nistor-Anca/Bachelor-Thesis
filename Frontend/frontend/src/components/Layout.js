import React from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';

const Layout = ({ children }) => {
  return (
    <>
      <ResponsiveAppBar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
