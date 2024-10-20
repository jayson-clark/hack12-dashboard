// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from 'routes.js';

// Custom Chakra theme
export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const [fixed] = useState(false);

  const getRoute = () => {
    return window.location.pathname !== '/admin/full-screen-maps';
  };

  const getRoutes = (routes) => {
    return routes.map((route, key) => {
      if (route.layout === '/admin') {
        return (
          <Route path={`${route.path}`} element={route.component} key={key} />
        );
      }
      if (route.collapse) {
        return getRoutes(route.items);
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = 'ltr';
  const { onOpen } = useDisclosure();
  document.documentElement.dir = 'ltr';

  return (
        <Box
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          w="100%"
          maxWidth="100%"
          padding="20px" // Apply 20px padding around the whole page
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Portal>
            <Box></Box>
          </Portal>

          {getRoute() ? (
            <Box
              mx="auto"
            >
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={<Navigate to="/admin/default" replace />}
                />
              </Routes>
            </Box>
          ) : null}
          <Box>
          </Box>
        </Box>
  );
}

