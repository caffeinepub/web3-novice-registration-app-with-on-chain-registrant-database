# Deployment Guide

This document provides instructions for deploying the Web3 Novice application to the Internet Computer and verifying the deployment.

## Overview

The frontend has been hardened to work reliably on mainnet even when build-time environment variables are not injected. The app will:
- **Infer network** from the hostname (icp0.io/ic0.app = mainnet)
- **Infer frontend canister ID** from the hostname when running on IC domains
- **Derive public URL** consistently using the inferred or configured canister ID (normalized to icp0.io)
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
   
   After deployment, dfx will output the canister IDs. **Copy these exactly and record them below:**
   
   ```
   Deployed canisters.
   URLs:
     Backend canister via Candid interface:
       backend: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=<BACKEND_CANISTER_ID>
     Frontend canister via browser:
       frontend: https://<FRONTEND_CANISTER_ID>.icp0.io/
   ```
   
   **📋 DEPLOYMENT RECORD TEMPLATE**
   
   Copy the exact values from your deployment output and paste them here:
   
   ```
   Deployment Date: [YYYY-MM-DD HH:MM]
   Network: ic (mainnet)
   
   Frontend Canister ID: _______________________________
   Backend Canister ID:  _______________________________
   
   Public URL (icp0.io): https://_______________________________.icp0.io/
   Alternative URL (ic0.app): https://_______________________________.ic0.app/
   ```
   
   **Important Notes:**
   - The frontend canister ID is the subdomain in the public URL
   - Both icp0.io and ic0.app URLs will work, but icp0.io is preferred
   - Keep this record for future reference and troubleshooting
   - If you redeploy, the canister IDs may change - update this record accordingly

3. **Verify the deployment**
   
   Open the public URL in a **fresh/incognito browser session** (to avoid cached credentials):
   ```
   https://<FRONTEND_CANISTER_ID>.icp0.io/
   ```
   
   Expected results:
   - [ ] The application loads successfully
   - [ ] No "Canister ID Not Resolved" error appears
   - [ ] The landing page displays correctly
   - [ ] You can navigate between pages
   
   **If you see "Canister ID Not Resolved":**
   - Wait 2-3 minutes for DNS propagation
   - Try the alternative ic0.app URL: `https://<FRONTEND_CANISTER_ID>.ic0.app/`
   - Verify you copied the correct canister ID from the deployment output
   - Check that the canister ID in the URL matches the one from `dfx deploy` output

4. **Verify Deployment Info component**
   
   Once the app loads:
   - [ ] Scroll to the footer and click "Deployment Info"
   - [ ] Verify Network shows "Internet Computer (Mainnet)"
   - [ ] Verify Shareable Public URL matches `https://<FRONTEND_CANISTER_ID>.icp0.io/`
   - [ ] Verify Frontend Canister ID is displayed (should match your deployment record)
   - [ ] Verify Backend Canister ID is displayed (not "Not configured")
   - [ ] Verify no mismatch warning is shown
   
   **If Backend Canister ID shows "Not configured":**
   - The build did not receive the VITE_BACKEND_CANISTER_ID environment variable
   - Authentication and data operations will fail
   - See "Troubleshooting: Missing Backend Canister ID" below

5. **Test authentication**
   - [ ] Click "Login" and complete Internet Identity authentication
   - [ ] Verify you can create a profile
   - [ ] Verify you can register as a novice
   - [ ] Verify you can view the directory

## Environment Variables

The application supports the following environment variables for deployment configuration:

### Frontend Canister ID
The frontend canister ID can be provided via either:
- `VITE_FRONTEND_CANISTER_ID` (preferred, explicit)
- `VITE_CANISTER_ID` (legacy, still supported)

If both are present, `VITE_FRONTEND_CANISTER_ID` takes precedence.

**Note:** On mainnet, the frontend canister ID is automatically detected from the hostname, so these variables are optional. They are primarily used for build-time configuration and mismatch detection.

### Backend Canister ID
- `VITE_BACKEND_CANISTER_ID` (required for mainnet)

This variable **must** be set during the build process for mainnet deployments. Without it, the app cannot communicate with the backend.

### Network
- `VITE_DFX_NETWORK` (optional, auto-detected)

The network is automatically inferred from the hostname:
- `*.icp0.io` or `*.ic0.app` → mainnet (`ic`)
- Other hostnames → local development

### Example Build Command
