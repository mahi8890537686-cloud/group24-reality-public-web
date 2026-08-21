# Phase 0 — Foundation

**Release A. Depends on:** nothing (first phase). **Unblocks:** every subsequent phase.

## Functional spec

Phase 0 ships no end-user-visible feature. It lays the schema and access-control groundwork every later
phase builds on, so nothing after it requires a migration.

1. **Roles.** Replace the current single-login admin model with `admin` / `agent` roles. Admin: full
   visibility and write access. Agent: sees/edits records they own or that are unassigned.
2. **`Unit` schema.** Introduce the sellable-inventory primitive (master spec §4.3) now, even though the
   Inventory UI doesn't ship until P4 — so `Deal.listingId` (P3) and later phases never need a backfill.
3. **Shared UI primitives.** Build `<ListView>`, `<RecordPanel>`, `<ActivityTimeline>` once, generically,
   so every module from P1 onward reuses them instead of each phase inventing its own table/detail-view.
4. **`activities` and `tasks` collections.** Also foundational — every phase from P1 on writes to them.

## Data model touched

New: `users`, `units`, `automation_rules` (schema only, engine ships P1+), `activities`, `tasks`.
See `docs/crm/data-model.md` §P0 for full field lists.

## Security rules (baseline, extended per phase)

```
function isSignedIn() { return request.auth != null; }
function role() { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role; }
function isAdmin() { return isSignedIn() && role() == 'admin'; }
function isOwner(data) { return isSignedIn() && data.ownerId == request.auth.uid; }

match /users/{uid} {
  allow read: if isSignedIn();
  allow write: if isAdmin();
}
match /units/{id} {
  allow read: if isSignedIn();
  allow write: if isAdmin();   // agents never directly edit inventory status; P4 adds server-action paths
}
match /activities/{id} {
  allow read: if isSignedIn();
  allow create: if isSignedIn();
  allow update, delete: if isAdmin();   // activity log is append-only for agents
}
match /tasks/{id} {
  allow read: if isAdmin() || resource.data.ownerId == request.auth.uid;
  allow write: if isAdmin() || resource.data.ownerId == request.auth.uid;
}
```

## Build steps

1. **`users` collection + role bootstrap.** Add `role`/`active` fields; write a one-time admin script
   (`scripts/bootstrap-admin.ts`, service-account) to create the first `admin` user doc for the existing
   Firebase Auth account. New agents added via a simple admin-only "Invite user" form (email + role →
   Firebase Auth `createUser` via `firebase-admin` in a server action + matching `users/{uid}` doc).
2. **`useAuth` extension.** Extend `src/lib/auth-context.tsx` to fetch and expose `role` alongside the
   existing Firebase user, so client components can branch on it without a Firestore read on every render
   (cache role in the auth context, refresh on auth state change).
3. **`AdminSidebar.tsx` role-awareness.** Hide admin-only nav items (Settings, Channel Partners commission
   approval, etc. — added incrementally per phase) when `role === 'agent'`.
4. **`units/{id}` type + Firestore accessor.** Add `Unit` to `src/types/index.ts`, create
   `src/lib/firestore/units.ts` following the existing accessor pattern (`fromDoc`, CRUD functions) seen in
   `contacts.ts`/`leads.ts`. No UI yet — P4 builds the Inventory screen against this.
5. **`activities`/`tasks` types + accessors.** Same pattern: `src/types/index.ts` additions,
   `src/lib/firestore/activities.ts`, `src/lib/firestore/tasks.ts`. Add a generic `logActivity(relatedType,
   relatedId, type, body?, metadata?)` helper — every later phase calls this instead of writing to the
   collection directly, keeping the shape consistent.
6. **`<ListView>` component.** Generic, prop-driven: columns config, filter config, saved-views hook
   (`users/{uid}/savedViews` — schema only for now, UI in P1), row-select + bulk action slot, CSV export
   using existing dependencies (no new library — hand-roll CSV from row data). Location:
   `src/components/crm/ListView.tsx`.
7. **`<RecordPanel>` component.** Slide-over shell with tab slot, `?panel=<id>` query-param
   open/close so it's deep-linkable. Location: `src/components/crm/RecordPanel.tsx`.
8. **`<ActivityTimeline>` component.** Renders `activities` for a given `relatedType`/`relatedId`, grouped
   by day, with an inline "add note" quick-form calling `logActivity`. Location:
   `src/components/crm/ActivityTimeline.tsx`.
9. **`firestore.indexes.json`.** Add `(units: projectId, status)`, `(units: status, heldUntil)`,
   `(tasks: ownerId, status, dueAt)`, `(activities: relatedType, relatedId, createdAt desc)`.
10. **`firestore.rules`.** Add the rules block above; deploy.

## Manual verification

- Log in as the bootstrapped admin; confirm `role: 'admin'` appears in the auth context (React DevTools or a
  temporary debug line).
- Invite a second test user as `agent`; log in as them; confirm they can read `units` but not write.
- Create a `unit` doc via the Firestore console; confirm `src/lib/firestore/units.ts`'s `getAllUnits()`
  returns it in a throwaway test page.
- Call `logActivity` from a temporary button; confirm `<ActivityTimeline>` renders it grouped under today.
- Confirm `<ListView>` renders a static array of rows with working column sort and a working CSV export
  button, before any real module wires into it.

## Automated checks

- `npm run build` passes (TypeScript strict — new types must be fully typed, no `any`).
- `npm run lint` passes.
