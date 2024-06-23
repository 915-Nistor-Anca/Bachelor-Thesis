import React from 'react';
import ViewerResponsiveAppBar from './ViewerResponsiveAppBar';

const ViewerLayout = ({ children }) => {
  return (
    <>
      <ViewerResponsiveAppBar />
      <main>{children}</main>
    </>
  );
};

export default ViewerLayout;
