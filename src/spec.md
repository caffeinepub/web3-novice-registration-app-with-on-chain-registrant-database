# Specification

## Summary
**Goal:** Update the Game page so the player can remove only one brick per session, reveal a congratulatory message after removal, and remove all clue/hint UI.

**Planned changes:**
- Limit brick removal to a single successful removal per page load/session; after one removal, disable interaction on all remaining intact bricks (no confirmation dialog, no further removals).
- Reveal the exact text `Congrats ! You just got your first REAL WORLD ASSET` behind/under the brick grid only after the single allowed brick is removed.
- Remove the entire clue/hint section from the bottom of the Game page (clue image card and accompanying hint text), ensuring no clue-related UI remains.

**User-visible outcome:** On `/game`, the user can remove exactly one brick (with the existing confirmation flow). After that, all other bricks are disabled, and the message `Congrats ! You just got your first REAL WORLD ASSET` is revealed behind the brick wall; the clue/hint section no longer appears.
