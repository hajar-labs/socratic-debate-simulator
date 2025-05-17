import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';
import { DebateContextProvider } from '../contexts/DebateContext';
import { UserContextProvider } from '../contexts/UserContext';
import { trackEvent } from '../services/analyticsService';
import { ANALYTICS_EVENTS } from '../services/analyticsService';

/**
 * Initialize the application router with context providers
 * Sets up route change tracking for analytics
 */
const Router = () => {
  // Create the router instance with routes defined in routes.js
  const router = createBrowserRouter(routes);
  
  // Track navigation changes
  const trackNavigation = (location) => {
    trackEvent(ANALYTICS_EVENTS.NAVIGATION_CHANGED, {
      path: location.pathname,
      search: location.search,
      referrer: document.referrer || null
    });
  };
  
  // Set up navigation tracking
  React.useEffect(() => {
    // Listen for route changes
    const unlisten = router.subscribe(({ location }) => {
      if (location) {
        trackNavigation(location);
      }
    });
    
    // Initial page load tracking
    trackNavigation(window.location);
    
    // Clean up listener
    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [router]);
  
  return (
    <UserContextProvider>
      <DebateContextProvider>
        <RouterProvider router={router} />
      </DebateContextProvider>
    </UserContextProvider>
  );
};

export default Router;