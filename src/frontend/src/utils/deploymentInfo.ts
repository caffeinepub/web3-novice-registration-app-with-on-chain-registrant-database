/**
 * Deployment information utility
 * Reads deployment identifiers from build-time environment variables
 * and infers them from runtime context when not available
 */

export interface DeploymentInfo {
  network: string;
  backendCanisterId: string | null;
  frontendCanisterId: string | null;
  publicUrl: string | null;
  currentOrigin: string | null;
  isInferred: {
    network: boolean;
    frontendCanisterId: boolean;
  };
  hasMismatch: boolean;
  mismatchDetails: string | null;
  correctPublicUrl: string | null;
  remediationMessage: string | null;
}

/**
 * Infer network from current hostname
 * Returns 'ic' if on icp0.io or ic0.app, 'local' otherwise
 */
function inferNetworkFromHostname(): string {
  if (typeof window === 'undefined') return 'local';
  const hostname = window.location.hostname;
  
  // Check for IC mainnet domains
  if (hostname.endsWith('.icp0.io') || hostname.endsWith('.ic0.app') || hostname.endsWith('.raw.icp0.io') || hostname.endsWith('.raw.ic0.app')) {
    return 'ic';
  }
  
  return 'local';
}

/**
 * Infer frontend canister ID from hostname
 * Extracts canister ID from icp0.io or ic0.app URLs
 */
function inferFrontendCanisterIdFromHostname(): string | null {
  if (typeof window === 'undefined') return null;
  const hostname = window.location.hostname;
  
  // Match pattern: <canister-id>.icp0.io or <canister-id>.ic0.app
  const icp0Match = hostname.match(/^([a-z0-9-]+)\.icp0\.io$/);
  if (icp0Match) return icp0Match[1];
  
  const ic0Match = hostname.match(/^([a-z0-9-]+)\.ic0\.app$/);
  if (ic0Match) return ic0Match[1];
  
  // Match pattern: <canister-id>.raw.icp0.io or <canister-id>.raw.ic0.app
  const rawIcp0Match = hostname.match(/^([a-z0-9-]+)\.raw\.icp0\.io$/);
  if (rawIcp0Match) return rawIcp0Match[1];
  
  const rawIc0Match = hostname.match(/^([a-z0-9-]+)\.raw\.ic0\.app$/);
  if (rawIc0Match) return rawIc0Match[1];
  
  return null;
}

/**
 * Get deployment information from environment variables with runtime inference fallbacks
 * Provides robust configuration detection for mainnet deployments
 */
export function getDeploymentInfo(): DeploymentInfo {
  // Read from Vite environment variables (build-time)
  const envNetwork = import.meta.env.VITE_DFX_NETWORK;
  const envBackendCanisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;
  const envFrontendCanisterId = import.meta.env.VITE_CANISTER_ID;
  
  // Infer from runtime context when env vars are missing
  const inferredNetwork = inferNetworkFromHostname();
  const inferredFrontendCanisterId = inferFrontendCanisterIdFromHostname();
  
  // Use env vars if available, otherwise use inferred values
  const network = envNetwork || inferredNetwork;
  const backendCanisterId = envBackendCanisterId || null;
  
  // For mainnet, prefer inferred canister ID from hostname (it's the source of truth)
  // For local, prefer env var
  let frontendCanisterId: string | null;
  if (network === 'ic' && inferredFrontendCanisterId) {
    frontendCanisterId = inferredFrontendCanisterId;
  } else {
    frontendCanisterId = envFrontendCanisterId || inferredFrontendCanisterId;
  }
  
  // Track which values were inferred (for diagnostic display)
  const isInferred = {
    network: !envNetwork,
    frontendCanisterId: !envFrontendCanisterId && !!inferredFrontendCanisterId,
  };
  
  // Detect mismatch between configured and inferred canister IDs
  let hasMismatch = false;
  let mismatchDetails: string | null = null;
  let correctPublicUrl: string | null = null;
  let remediationMessage: string | null = null;
  
  if (network === 'ic' && envFrontendCanisterId && inferredFrontendCanisterId) {
    if (envFrontendCanisterId !== inferredFrontendCanisterId) {
      hasMismatch = true;
      correctPublicUrl = `https://${inferredFrontendCanisterId}.icp0.io`;
      mismatchDetails = `Build configuration specifies frontend canister ${envFrontendCanisterId}, but you are accessing ${inferredFrontendCanisterId}.`;
      remediationMessage = `You are viewing the app through canister ${inferredFrontendCanisterId}, but the build was configured for ${envFrontendCanisterId}. To resolve this, open the correct URL: ${correctPublicUrl}`;
    }
  }
  
  // Derive public URL
  let publicUrl: string | null = null;
  if (network === 'ic' && frontendCanisterId) {
    // Always use icp0.io for mainnet public URLs
    publicUrl = `https://${frontendCanisterId}.icp0.io`;
  } else if (typeof window !== 'undefined') {
    // For local or other networks, use current origin
    publicUrl = window.location.origin;
  }
  
  // Get current origin for diagnostics
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : null;

  return {
    network,
    backendCanisterId,
    frontendCanisterId,
    publicUrl,
    currentOrigin,
    isInferred,
    hasMismatch,
    mismatchDetails,
    correctPublicUrl: correctPublicUrl || publicUrl,
    remediationMessage,
  };
}

/**
 * Format canister ID for display with copy-friendly formatting
 */
export function formatCanisterId(canisterId: string | null): string {
  if (!canisterId) return 'Not configured';
  return canisterId;
}

/**
 * Get network display name
 */
export function getNetworkDisplayName(network: string): string {
  switch (network) {
    case 'ic':
      return 'Internet Computer (Mainnet)';
    case 'local':
      return 'Local Development';
    default:
      return network;
  }
}

/**
 * Check if deployment info is complete for mainnet
 */
export function isMainnetConfigComplete(info: DeploymentInfo): boolean {
  if (info.network !== 'ic') return true; // Not mainnet, no requirements
  return !!(info.frontendCanisterId && info.backendCanisterId && info.publicUrl);
}

/**
 * Get diagnostic message for incomplete configuration
 */
export function getConfigDiagnostic(info: DeploymentInfo): string | null {
  if (info.network !== 'ic') return null;
  
  const missing: string[] = [];
  if (!info.frontendCanisterId) missing.push('Frontend Canister ID');
  if (!info.backendCanisterId) missing.push('Backend Canister ID');
  
  if (missing.length === 0) return null;
  
  return `Missing configuration: ${missing.join(', ')}. The app may not function correctly.`;
}
