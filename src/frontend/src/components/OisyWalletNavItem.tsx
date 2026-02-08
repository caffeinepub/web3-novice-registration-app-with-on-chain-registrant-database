import { ExternalLink, Wallet, Lock } from 'lucide-react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getOisyWalletUrl, isOisyWalletConfigured } from '../utils/oisyWallet';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OisyWalletNavItemProps {
  /** Whether this is being rendered in the mobile menu */
  isMobile?: boolean;
  /** Callback to close mobile menu after navigation */
  onNavigate?: () => void;
}

export default function OisyWalletNavItem({ isMobile = false, onNavigate }: OisyWalletNavItemProps) {
  const { isAuthenticated } = useCurrentUser();
  const walletUrl = getOisyWalletUrl();
  const isConfigured = isOisyWalletConfigured();

  const handleWalletClick = () => {
    if (isAuthenticated && isConfigured && walletUrl) {
      window.open(walletUrl, '_blank', 'noopener,noreferrer');
      onNavigate?.();
    }
  };

  // Not authenticated - show locked state
  if (!isAuthenticated) {
    if (isMobile) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/40 opacity-60">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Wallet</span>
            <span className="text-xs text-muted-foreground">Sign in to access</span>
          </div>
        </div>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-medium text-muted-foreground opacity-60 cursor-not-allowed inline-flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Wallet
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sign in to access your wallet</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Not configured - show disabled state with message
  if (!isConfigured) {
    if (isMobile) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/40 opacity-60">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Wallet</span>
            <span className="text-xs text-muted-foreground">Not configured</span>
          </div>
        </div>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-medium text-muted-foreground opacity-60 cursor-not-allowed inline-flex items-center gap-1">
              <Wallet className="h-3 w-3" />
              Wallet
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Wallet link is not configured</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Authenticated and configured - show active link
  if (isMobile) {
    return (
      <button
        onClick={handleWalletClick}
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary text-left"
      >
        <Wallet className="h-4 w-4" />
        <span>OISY Wallet</span>
        <ExternalLink className="h-3 w-3 ml-auto" />
      </button>
    );
  }

  return (
    <a
      href={walletUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium transition-colors hover:text-primary inline-flex items-center gap-1"
    >
      <Wallet className="h-3 w-3" />
      Wallet
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}
