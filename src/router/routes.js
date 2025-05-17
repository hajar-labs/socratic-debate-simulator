import { Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import DebatePage from '../pages/DebatePage';
import ExpertProfilePage from '../components/experts/ExpertProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import SettingsPage from '../pages/SettingsPage';
import SavedDebatesPage from '../pages/SavedDebatesPage';
import AboutPage from '../pages/AboutPage';
import Layout from '../components/common/Layout';
import { isFirstVisit } from '../services/userPreferences';

/**
 * Application routes configuration
 * Defines all routes and their corresponding components
 * Uses Layout component as a wrapper for consistent UI
 */
const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: isFirstVisit() ? <AboutPage showOnboarding={true} /> : <HomePage />
      },
      {
        path: 'debate',
        children: [
          {
            index: true,
            element: <Navigate to="/" replace />
          },
          {
            path: 'new',
            element: <HomePage startNewDebate={true} />
          },
          {
            path: ':debateId',
            element: <DebatePage />
          },
          {
            path: ':debateId/takeaways',
            element: <DebatePage showTakeaways={true} />
          }
        ]
      },
      {
        path: 'experts',
        children: [
          {
            index: true,
            element: <Navigate to="/" replace />
          },
          {
            path: ':expertId',
            element: <ExpertProfilePage />
          }
        ]
      },
      {
        path: 'saved',
        element: <SavedDebatesPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'help',
        element: <AboutPage showHelp={true} />
      }
    ]
  },
  // Auth routes could be added here if needed
  {
    path: '/auth',
    children: [
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  },
  // Catch-all route
  {
    path: '*',
    element: <NotFoundPage />
  }
];

export default routes;