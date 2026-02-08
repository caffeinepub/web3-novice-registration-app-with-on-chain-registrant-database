import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu, X, IdCard, AlertTriangle, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import AuthControls from './AuthControls';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useGetUserBadge } from '../hooks/useUserBadge';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import DeploymentInfo from './DeploymentInfo';
import { getDeploymentInfo } from '../utils/deploymentInfo';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();
  const { data: userBadge, isLoading: badgeLoading } = useGetUserBadge();
  const deploymentInfo = getDeploymentInfo();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Register', path: '/registration' },
    { label: 'Directory', path: '/directory' },
    { label: 'Public Profiles', path: '/public-profiles' },
    { label: 'Events', path: '/events' },
    { label: 'World', path: '/world' },
    { label: 'Game', path: '/game' },
  ];

  const handleNavClick = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Canister Mismatch Warning Banner */}
      {deploymentInfo.hasMismatch && (
        <div className="bg-destructive text-destructive-foreground py-2 px-4">
          <div className="container flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">
                Canister ID mismatch detected. Click Deployment Info for details.
              </span>
            </div>
            <DeploymentInfo />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <IdCard className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl hidden sm:inline">Web3 Novice</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  activeProps={{ className: 'text-primary' }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side: User Badge + Auth Controls + Deployment Info */}
            <div className="flex items-center gap-3">
              {/* User Badge (Desktop) */}
              {isAuthenticated && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <IdCard className="h-4 w-4 text-primary" />
                  {badgeLoading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : userBadge ? (
                    <span className="text-sm font-medium text-primary">{userBadge.uniqueId}</span>
                  ) : null}
                </div>
              )}

              {/* Auth Controls */}
              <AuthControls />

              {/* Deployment Info (Desktop) */}
              {!deploymentInfo.hasMismatch && (
                <div className="hidden md:block">
                  <DeploymentInfo />
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-3">
                {/* User Badge (Mobile) */}
                {isAuthenticated && userBadge && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 mb-2">
                    <IdCard className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{userBadge.uniqueId}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {userBadge.badge}
                    </Badge>
                  </div>
                )}

                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className="text-left px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                  >
                    {item.label}
                  </button>
                ))}

                {/* Deployment Info (Mobile) */}
                {!deploymentInfo.hasMismatch && (
                  <div className="pt-2 border-t mt-2">
                    <DeploymentInfo />
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© 2026. Built with</span>
              <span className="text-primary">❤️</span>
              <span>using</span>
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                caffeine.ai
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a
                href="https://dmctechnologies.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                DMC Technologies
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
