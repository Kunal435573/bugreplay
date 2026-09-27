# BugReplay

BugReplay turns one synthetic checkout bug into a reproducible evidence trail and a verified repair. It is the IBM Bob 2.0 Hackathon prototype for Northstar Demo.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then use `/bugs/BUG-001` for the seeded scenario and `/bugs/BUG-001/verification` for the recorded comparison.

## Test

```bash
npm test
npm run build
```

The original implementation deliberately returns $40 for a $50 cart with SAVE10. The repaired implementation returns $45. The original behavior is a labeled fixture used to demonstrate the before/after workflow.

## Bob IDE evidence

Relevant Bob task session consumption screenshots belong in `bob_sessions/`. See `deliverables/BugReplay-Complete-Product-and-Technical-Spec.md` for the prompts, architecture, and submission checklist.
