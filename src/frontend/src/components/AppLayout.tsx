import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu, X, IdCard } from 'lucide-react';
import { useState } from 'react';
import AuthControls from './AuthControls';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useGetUserBadge } from '../hooks/useUserBadge';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();
  const { data: userBadge, isLoading: badgeLoading, isError: badgeError } = useGetUserBadge();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/assets/generated/web3-novice-logo.dim_512x512.png" 
                alt="Web3 Novice" 
                className="h-10 w-10"
              />
              <span className="font-bold text-xl hidden sm:inline-block">Web3 Novice</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link 
                to="/directory" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Directory
              </Link>
              <Link 
                to="/register" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Register
              </Link>
              <Link 
                to="/events" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Events
              </Link>
              <a 
                href="https://www.dmc-technologies.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Learn More
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <IdCard className="h-4 w-4 text-primary" />
                {badgeLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : badgeError ? (
                  <span className="text-xs text-muted-foreground">Badge unavailable</span>
                ) : userBadge ? (
                  <span className="text-xs font-medium text-primary">
                    ID: {userBadge.uniqueId}
                  </span>
                ) : null}
              </div>
            )}
            
            <div className="hidden md:block">
              <AuthControls />
            </div>
            
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background">
            <nav className="container py-4 flex flex-col gap-4">
              {isAuthenticated && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <IdCard className="h-4 w-4 text-primary" />
                  {badgeLoading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : badgeError ? (
                    <span className="text-xs text-muted-foreground">Badge unavailable</span>
                  ) : userBadge ? (
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-primary">
                        ID: {userBadge.uniqueId}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {userBadge.badge}
                      </span>
                    </div>
                  ) : null}
                </div>
              )}
              
              <Link 
                to="/" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/directory" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Directory
              </Link>
              <Link 
                to="/register" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
              <Link 
                to="/events" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <a 
                href="https://www.dmc-technologies.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Learn More
              </a>
              <div className="pt-2 border-t border-border/40">
                <AuthControls />
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2026. Built with ❤️ using{' '}
              <a 
                href="https://caffeine.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/directory" className="hover:text-primary transition-colors">
                Browse Novices
              </Link>
              <Link to="/register" className="hover:text-primary transition-colors">
                Join Community
              </Link>
              <a 
                href="https://www.dmc-technologies.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                DMC Technologies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
