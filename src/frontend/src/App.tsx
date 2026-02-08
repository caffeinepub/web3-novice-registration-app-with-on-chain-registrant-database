import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import AppLayout from './components/AppLayout';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import DirectoryPage from './pages/DirectoryPage';
import EventsPage from './pages/EventsPage';
import WorldPage from './pages/WorldPage';
import PublicProfilesPage from './pages/PublicProfilesPage';
import GamePage from './pages/GamePage';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

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

const registrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/registration',
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

const worldRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/world',
  component: WorldPage,
});

const publicProfilesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/public-profiles',
  component: PublicProfilesPage,
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game',
  component: GamePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  registrationRoute,
  directoryRoute,
  eventsRoute,
  worldRoute,
  publicProfilesRoute,
  gameRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
