import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Pages
import HomePage from './HomePage';
import ChallengeListPage from './challengeList/ChallengeListPage';
import SignupPage from './signup/SignupPage';
import SigninPage from './signin/SigninPage';
import ChallengeQueuePage from './challenge/ChallengeQueuePage';
import ChallengePage from './challenge/ChallengePage';
import SettingsPage from './settings/SettingsPage';
import InvitePage from './challenge/InvitePage';
import RecoveryPage from './recovery/RecoveryPage';
import GithubRegisterPage from './auth/GithubRegisterPage';
import RoadmapPage from './roadmap/RoadmapPage';
import PasswordResetPage from './auth/PasswordResetPage';
import ProfilePage from './profile/ProfilePage';
import NotFoundPage from './NotFoundPage';
import ProtectedRoute from '../layouts/ProtectedRoute';

const appRoutes = [
  {
    path: '/challenges',
    element: <ChallengeListPage />,
  },
  {
    path: '/c/:cId/:lang',
    exact: true,
    element: <ChallengeQueuePage />,
  },
  {
    path: '/c/:cId/r/:rId',
    element: <ChallengePage />,
  },
  // React Router Dom v6 removed optional params, duplicate to catch both
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/settings/:type',
    element: <SettingsPage />,
  },
  {
    path: '/profile/:username',
    element: <ProfilePage />,
  },
];

const landingRoutes = [
  {
    path: 'signup',
    element: <SignupPage />,
  },
  {
    path: 'signin',
    element: <SigninPage />,
  },
  {
    path: 'recovery',
    element: <RecoveryPage />,
  },
  {
    path: 'account/reset/password',
    element: <PasswordResetPage />,
  },
  {
    path: 'account/register',
    element: <GithubRegisterPage />,
  },
  {
    path: 'roadmap',
    element: <RoadmapPage />,
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: '/invite/:key',
    element: (
      <MainLayout>
        <ProtectedRoute>
          <InvitePage />
        </ProtectedRoute>
      </MainLayout>
    ),
  },
  ...landingRoutes.map((route) => ({
    ...route,
    element: <MainLayout>{route.element}</MainLayout>,
  })),
  ...appRoutes.map((route) => ({
    ...route,
    element: (
      <MainLayout>
        <ProtectedRoute>{route.element}</ProtectedRoute>
      </MainLayout>
    ),
  })),
]);

const Root = () => <RouterProvider router={router} />;

export default Root;
