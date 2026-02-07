# Specification

## Summary
**Goal:** Add a new “Digital World” page that visualizes total app signups as inhabitants on a 3D planet and keeps the count updated over time.

**Planned changes:**
- Add a new route (e.g., `/world`) and page that renders a 3D planet scene (React Three Fiber/Three.js).
- Add a backend query API to return the total number of registrants (count-only), enforcing the same authentication policy as existing registrant queries.
- Add a new React Query hook to fetch the registrant count, poll periodically, and handle loading + non-blocking error states.
- Render inhabitant visuals equal to the fetched count, show an explicit numeric total (e.g., “Inhabitants: N”), and animate newly added inhabitants when the count increases while keeping placement deterministic and stable across refreshes.
- Add a header navigation link (desktop + mobile) to the new page, consistent with existing TanStack Router navigation behavior.

**User-visible outcome:** Users can navigate to a new “Digital World” page that shows a 3D planet with an inhabitant representation for each signup and a live-updating “Inhabitants” total; unauthenticated users see a sign-in prompt.
