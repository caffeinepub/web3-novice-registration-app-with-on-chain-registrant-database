# Deployment Guide

This document provides instructions for deploying the Web3 Novice application to the Internet Computer and verifying the deployment.

## Overview

The frontend has been hardened to work reliably on mainnet even when build-time environment variables are not injected. The app will:
- **Infer network** from the hostname (icp0.io/ic0.app = mainnet)
- **Infer frontend canister ID** from the hostname when running on IC domains
- **Derive public URL** consistently using the inferred or configured canister ID
- **Provide diagnostics** via the in-app Deployment Info component
- **Detect mismatches** between configured and actual canister IDs
- **Display global warnings** when canister/domain mismatches are detected
- **Provide one-click remediation** to navigate to the correct URL

## Deployment Checklist

### Pre-Deployment
- [ ] Ensure all code changes are committed
- [ ] Run `npm run typescript-check` to verify TypeScript compilation
- [ ] Test the application locally with `npm start`
- [ ] Verify Internet Identity authentication works locally

### Deployment Steps

1. **Build and deploy the application**
   ```bash
   dfx deploy --network ic
   ```

2. **Capture the exact canister IDs from deployment output**
   After deployment, dfx will output the canister IDs. **Copy these exactly:**
   ```
   Deployed canisters.
   URLs:
     Backend canister via Candid interface:
       backend: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=[backend-canister-id]
     Frontend canister via browser:
       frontend: https://[frontend-canister-id].icp0.io/
   ```
   
   **Record these values:**
   - Backend canister ID: `[backend-canister-id]`
   - Frontend canister ID: `[frontend-canister-id]`
   - Frontend public URL: `https://[frontend-canister-id].icp0.io`

3. **Immediately verify the deployment**
   - Open the frontend public URL from step 2 in your browser
   - If you see "Canister ID Not Resolved", **STOP** - the deployment failed or the canister ID is incorrect
   - If the page loads, proceed to step 4

4. **Use Deployment Info as your source of truth**
   - Once the app loads, click "Deployment Info" button in the footer
   - **Verify all fields match your deployment:**
     - Network: "Internet Computer (Mainnet)"
     - Shareable Public URL: Should match the URL from step 2 and show "✓ This is the correct URL to share"
     - Frontend Canister ID: Should match the ID from step 2 and show "(detected from URL)"
     - Backend Canister ID: Should match the ID from step 2 (not "Not configured")
   - **If any mismatch warnings appear**, follow the remediation steps in the warning message
   - **Copy all three values** (Public URL, Frontend Canister ID, Backend Canister ID) using the copy buttons for your records

5. **Share the deployment**
   - Use the "Shareable Public URL" from Deployment Info (not the browser address bar)
   - Share the frontend canister ID and backend canister ID from Deployment Info
   - Verify the shared URL opens correctly in a new browser/incognito window

### Environment Variables (Optional but Recommended)

For optimal functionality, set these environment variables before building:

#### Required for Production
- `VITE_BACKEND_CANISTER_ID`: Backend canister ID (auto-detected if not set)
- `VITE_FRONTEND_CANISTER_ID`: Frontend canister ID (auto-detected if not set)

#### Optional Features
- `VITE_OISY_WALLET_URL`: URL to the OISY wallet (e.g., `https://oisy.com`)
  - If not set, the Wallet navigation item will be disabled with a message explaining the wallet link is not configured
  - When set, authenticated users can access their OISY wallet via the navigation menu
  - The wallet opens in a new tab with secure link attributes

Example `.env.production` file:
