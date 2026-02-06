# Specification

## Summary
**Goal:** Automatically issue a persistent user ID and badge on first authentication, display it in the UI, and add navigation/content for an external informational site plus an Events/Coming Soon page.

**Planned changes:**
- Backend: Add upgrade-safe storage and APIs that create-and-return a unique user ID and badge for the authenticated principal on first read, and return the same values on subsequent calls.
- Backend: Enforce that callers can only read their own issued ID+badge (unless an explicit admin pathway already exists).
- Frontend: After Internet Identity sign-in, fetch and display the user’s issued ID and badge without blocking the existing registration/profile flow; handle failures with a non-blocking fallback.
- Frontend: Add a clearly labeled external link to https://www.dmc-technologies.fr (opens in a new tab) and add brief landing-page English copy describing the objective (creating an ICP real-world network).
- Frontend: Create an /events (Events/Coming Soon) page, add it to header navigation (desktop/mobile), include English copy explaining step 1 (creating an ID) is done and the next step is coming soon, plus a link to https://www.dmc-technologies.fr.

**User-visible outcome:** On first login, users are automatically assigned an ID and badge that persist across logins and are shown in the app; users can navigate to an Events/Coming Soon page and follow an external link to learn more about the ICP real-world network objective.
