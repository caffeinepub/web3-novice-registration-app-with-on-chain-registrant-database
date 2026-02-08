# Specification

## Summary
**Goal:** Restore a working Internet Computer (mainnet) deployment by re-running `dfx deploy --network ic`, capturing the new canister IDs, and confirming the frontend URL is reachable without gateway resolution errors.

**Planned changes:**
- Re-run `dfx deploy --network ic` and record the deployed frontend and backend canister IDs from the deployment output.
- Verify the deployed frontend loads successfully at `https://[frontend-canister-id].icp0.io/` and does not show “Canister ID Not Resolved”, including addressing the previously failing URL `https://5cpxd-piaaa-aaaap-qib3q-cai.icp0.io`.
- Use the app’s Deployment Info diagnostics on mainnet to confirm the correct network, matching shareable public URL, and a configured (non-empty) backend canister ID with no mismatch warning.

**User-visible outcome:** The app is accessible via the correct `icp0.io` canister URL on mainnet, and Deployment Info accurately reflects the active frontend URL and backend canister ID without mismatch errors.
