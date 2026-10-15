# Checklist Social App — Product Spec

**Project:** checklist-social-app
**Platform:** React Native / Expo
**Status:** Draft v1
**Last updated:** 2026-08-17

---

## 1. Overview

A social platform built around checklists as shareable, discoverable content. Instead of creating a checklist from scratch, users search for one already made by someone who did the same thing (e.g. a trip from New Zealand to Bali) and copy it to their own account. Users can also collaborate on checklists for shared events, assigning individual items to specific people.

**Core loop:** Create → Discover → Copy → Collaborate

---

## 2. Goals

- Let users create and publish checklists tied to real-world events (trips, parties, moves, etc.)
- Make checklists discoverable via structured filters, not just search
- Let users clone and personalize someone else's checklist
- Let users collaborate on a shared checklist, assigning items to specific people
- Give each user a clear view of what's been assigned to them across all their checklists

---

## 3. Non-Goals (out of scope for MVP)

- Real-time chat / messaging between users
- Monetization (paid checklists, ads, etc.)
- Web app version (mobile only, Expo)
- Public API for third-party integrations

---

## 4. User Roles

| Role | Description |
|---|---|
| Owner | Creator of a checklist; can edit, invite collaborators, assign items, delete |
| Collaborator | Invited to a checklist; can check off items, be assigned items, comment (Phase 3) |
| Viewer | Anyone browsing public checklists; can view and copy, cannot edit the original |

---

## 5. Data Model (high-level)

**User**
- id, name, avatar, gender, home_country, created_at
- friends: [User.id]

**Checklist**
- id, owner_id, title, description
- items: [ChecklistItem]
- destination_country, origin_country, event_type
- season, budget_range *(Phase 2)*
- visibility: `public` | `private` | `friends_only` *(friends_only in Phase 2)*
- source_checklist_id (nullable — set if this was copied from another list)
- created_at, updated_at

**ChecklistItem**
- id, checklist_id, text, is_checked
- assigned_to: User.id (nullable)
- note *(Phase 3)*

**Collaboration**
- checklist_id, user_id, role (`owner` | `collaborator`), invited_at, accepted_at

**Friendship**
- user_id, friend_id, status (`pending` | `accepted`), created_at

---

## 6. MVP Feature Spec (Phase 1)

### 6.1 Accounts
- Sign up / login (email + password to start; social login later)
- Edit profile: name, avatar, gender, home country
- **Acceptance criteria:** a new user can register, log in, and edit their profile in under 2 minutes

### 6.2 Friends
- Send/accept/reject friend requests
- View friend list
- **Acceptance criteria:** a user can add another user as a friend and see them in their friends list

### 6.3 Checklist Creation
- Create checklist: title, description, list of checkable items
- Tag with destination country, origin country, event type
- Set visibility: public or private
- Edit / delete own checklist
- **Acceptance criteria:** a user can create a checklist with at least one item, tag it, and publish it as public or private

### 6.4 Discovery
- Browse public checklists
- Filter by destination country and origin country
- View a checklist's full detail (items, tags, owner)
- **Acceptance criteria:** a user can filter checklists by "origin: NZ, destination: Indonesia" and see matching results

### 6.5 Copy Checklist
- "Copy to my account" action on any public checklist
- Copy creates a new checklist owned by the copier, linked via `source_checklist_id`
- Copied checklist is fully editable, independent of the original
- **Acceptance criteria:** copying a checklist creates a new private checklist under the copier's account with all items intact

### 6.6 Collaboration
- Invite a friend to a checklist (as collaborator)
- Assign individual items to specific collaborators (including self)
- Collaborators can check off items
- "My assigned items" screen — shows all items assigned to the current user across every checklist they collaborate on
- **Acceptance criteria:** an owner can assign an item to a collaborator, and that collaborator sees it in their "My assigned items" view

---

## 6.7 Remove Collaborator
- The checklist owner can remove a collaborator at any time.
- Removed collaborators immediately lose access to the checklist.
- Any items assigned to the removed collaborator become unassigned.
- Completed items remain completed.
- The removed collaborator no longer sees the checklist in "My Checklists" or "My Assigned Items".

## 7. Screens (MVP)

1. **Auth** — Sign up / Login
2. **Home / Discover** — browse + filter public checklists
3. **Checklist Detail** — view items, owner, tags, copy/collaborate actions
4. **Create/Edit Checklist** — title, description, items, tags, visibility
5. **My Checklists** — created, copied, collaborating on
6. **My Assigned Items** — cross-checklist assigned items view
7. **Friends** — friend list, requests, add friend
8. **Profile** — view/edit own profile

---

## 8. Phase 2 (Post-MVP)

- Additional filters: gender, season, budget
- Sort by popularity / most-copied
- Friends-only visibility tier
- Like / save / bookmark checklists
- "Used by X people" counter
- Comment on checklists

## 9. Phase 3 (Polish & Retention)

- Activity feed (friends' new/updated checklists)
- Notifications: item assigned, checklist liked/copied, friend activity
- Real-time collaboration status (live checkoffs)
- Item-level comments/notes
- Share checklist to profile

---

## 10. Open Questions

- Should copied checklists retain a visible link back to the original creator (attribution)?
- Do collaborators need approval from the owner before joining, or is invite = auto-join?
- Should private checklists be copyable at all, or only public ones?
- What happens to assigned items if a collaborator is removed from a checklist?
