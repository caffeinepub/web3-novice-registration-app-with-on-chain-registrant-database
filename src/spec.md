# Specification

## Summary
**Goal:** Remove the in-app wallet navigation entry point and allow registrants to save and display optional social links and a crypto address.

**Planned changes:**
- Remove any Wallet/OISY Wallet navigation items and related wallet messaging from the desktop header nav and mobile menu.
- Remove unused frontend references/dependencies on the OISY wallet URL configuration (VITE_OISY_WALLET_URL).
- Extend the backend registrant model and existing create/read/list/search APIs to store and return optional fields: Facebook, Instagram, Telegram, website URL, and crypto address.
- Update the registration/profile form to include optional inputs for “Facebook”, “Instagram”, “Telegram”, “Website”, and “Crypto address”, saved with the registrant record and pre-filled when revisiting.
- Update the directory UI to conditionally display each social link and crypto address only when present, staying visually consistent when absent.

**User-visible outcome:** Users no longer see any in-app wallet navigation entry, and they can optionally add social links and a crypto address to their profile which will appear in the directory when provided.
