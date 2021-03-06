import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AppLayout from '../layouts/AppLayout';

// Pages
import HomePage from './HomePage';
import ChallengeListPage from './challengeList/ChallengeListPage';
import SignupPage from './auth/SignupPage';
import SigninPage from './auth/SigninPage';
import ChallengeQueuePage from './challenge/ChallengeQueuePage';
import ChallengePage from './challenge/ChallengePage';
import SettingsPage from './settings/SettingsPage';
import InvitePage from './challenge/InvitePage';
import RecoveryPage from './auth/RecoveryPage';
import NotFoundPage from './NotFoundPage';
import GithubRegisterPage from './auth/GithubRegisterPage';
import RoadmapPage from './roadmap/RoadmapPage';
import PasswordResetPage from './auth/PasswordResetPage';
import ProfilePage from './profile/ProfilePage';

const appRoutes = [
  {
    path: '/challenges',
    component: ChallengeListPage,
  },
  {
    path: '/c/:cId/:lang',
    exact: true,
    component: ChallengeQueuePage,
  },
  {
    path: '/c/:cId/r/:rId',
    component: ChallengePage,
  },
  // React Router Dom v6 removed optional params, duplicate to catch both
  {
    path: '/settings',
    component: SettingsPage,
  },
  {
    path: '/settings/:type',
    component: SettingsPage,
  },
  {
    path: '/profile/:username',
    component: ProfilePage,
  },
];

const landingRoutes = [
  {
    path: '/',
    exact: true,
    component: HomePage,
  },
  {
    path: '/signup',
    component: SignupPage,
  },
  {
    path: '/signin',
    component: SigninPage,
  },
  {
    path: '/recovery',
    component: RecoveryPage,
  },
  {
    path: '/account/reset/password',
    component: PasswordResetPage,
  },
  {
    path: '/account/register',
    component: GithubRegisterPage,
  },
  {
    path: '/roadmap',
    component: RoadmapPage,
  },
];

const Root = () => (
  <Router>
    <Routes>
      {landingRoutes.map(({ path, exact, component: Comp }) => (
        <Route
          path={path}
          exact={exact}
          key={path}
          element={
            <MainLayout>
              <Comp />
            </MainLayout>
          }
        />
      ))}

      {appRoutes.map(({ path, exact, component: Comp }) => (
        <Route
          path={path}
          exact={exact}
          key={path}
          element={
            <AppLayout>
              <Comp />
            </AppLayout>
          }
        />
      ))}

      <Route path="/invite/:key" component={InvitePage} />
      <Route component={NotFoundPage} />
    </Routes>
  </Router>
);

export default Root;
