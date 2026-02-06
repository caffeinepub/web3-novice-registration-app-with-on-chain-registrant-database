import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import DirectoryPage from './pages/DirectoryPage';
import EventsPage from './pages/EventsPage';
import AppLayout from './components/AppLayout';
import ProfileSetupModal from './components/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <AppLayout />
      <ProfileSetupModal />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegistrationPage,
});

const directoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/directory',
  component: DirectoryPage,
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: EventsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, registerRoute, directoryRoute, eventsRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
