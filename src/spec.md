# Specification

## Summary
**Goal:** Let authenticated users open their OISY wallet from within the app via a safe external link in the header navigation.

**Planned changes:**
- Add a “Wallet” / “OISY Wallet” entry point to the header navigation and mobile menu that is shown for authenticated users and opens the OISY wallet in a new tab with safe `target`/`rel` attributes.
- For unauthenticated users, hide the wallet item or show a disabled/locked state with English text prompting the user to sign in first.
- Add a single frontend configuration point for the OISY wallet URL and disable the wallet action with a concise, non-blocking English message when the URL is missing/empty.

**User-visible outcome:** Signed-in users can click “Wallet” in the app navigation to open the OISY wallet in a new tab; if not signed in (or if the wallet URL isn’t configured), the UI clearly indicates what to do without breaking existing flows.
