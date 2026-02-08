/**
 * OISY Wallet configuration utility
 * Provides centralized access to the OISY wallet URL from environment variables
 */

/**
 * Get the configured OISY wallet URL from environment variables
 * @returns The OISY wallet URL if configured, undefined otherwise
 */
export function getOisyWalletUrl(): string | undefined {
  const url = import.meta.env.VITE_OISY_WALLET_URL;
  
  // Return undefined if not set or empty string
  if (!url || url.trim() === '') {
    return undefined;
  }
  
  return url.trim();
}

/**
 * Check if the OISY wallet is configured
 * @returns true if the wallet URL is configured, false otherwise
 */
export function isOisyWalletConfigured(): boolean {
  return getOisyWalletUrl() !== undefined;
}
