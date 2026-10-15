# Checklist Social

A social mobile app where checklists are the content. Instead of building a checklist from scratch, users discover ones already made by people who did the same thing (a trip from NZ to Bali, planning a house move, organising a birthday party) and copy them. Users can also collaborate on shared checklists, assigning items to specific people.

**Core loop:** Create > Discover > Copy > Collaborate

## Tech Stack

- **Framework:** React Native with Expo (SDK 57)
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based routing)
- **State Management:** TBD (Zustand or Redux Toolkit)
- **Backend:** TBD (Supabase or Firebase)
- **Authentication:** Email + password (social login deferred to Phase 2)

## Features (MVP)

### Accounts & Friends
- Sign up and login with email and password
- Edit profile: name, avatar, gender, home country
- Send, accept, or reject friend requests
- Search users by name

### Checklist Creation
- Create a checklist with title, description, and checkable items
- Tag with destination country, origin country, and types
- Set visibility: public or private
- Reorder items via drag-and-drop
- Edit or delete own checklists
- Voice assistant for hands-free checklist creation (planned)

### Types System
Checklists support multiple types from a predefined list of 18 categories:

| Type | Description |
|------|-------------|
| Travel (Country) | Domestic or single-country trips |
| Travel (Long Distance) | Multi-country or international travel |
| Birthday Party | Birthday event planning |
| Family Chores | Household task distribution |
| Work Duties | Workplace task tracking |
| Wedding | Wedding planning |
| Moving | House or apartment move |
| Baby Prep | Preparing for a new baby |
| Holiday | Seasonal or holiday planning |
| Camping | Outdoor and camping trips |
| Renovation | Home renovation projects |
| Grocery | Shopping lists |
| Fitness | Workout and fitness plans |
| Study | Academic and learning plans |
| Event | General event planning |
| Pet Care | Pet-related tasks |
| Project | Generic project management |
| Medical | Medical appointments and prep |

The type picker is a searchable multi-select combobox. Users type to filter the list, and selected types appear as removable chips. The same type list powers the discovery filter bar.

### Discovery
- Browse public checklists on the home screen
- Filter by destination country, origin country, and types
- Quick-access type pills with an expandable search panel
- View full checklist detail: items, tags, owner, copy count

### Copy Checklist
- One-tap "Copy to my account" on any public checklist
- Creates a private, fully editable copy linked to the original
- Attribution: "Originally by [owner name]" label on copies
- Original checklist's copy count increments
- Private checklists cannot be copied

### Collaboration
- Invite friends as collaborators (invite requires acceptance)
- Assign individual items to collaborators or yourself
- Collaborators can check off any item, not just their own
- "My Assigned Items" screen shows all assignments across all checklists
- Owner can remove collaborators (their items become unassigned, completed items stay completed)

## Data Model

### Core Entities

**User:** id, name, avatar, gender, home_country, created_at

**Checklist:** id, owner_id, title, description, destination_country, origin_country, types (string array), visibility (public/private), source_checklist_id, copy_count, created_at, updated_at

**ChecklistItem:** id, checklist_id, text, is_checked, assigned_to, position, note (Phase 3)

**Collaboration:** checklist_id, user_id, role (owner/collaborator), invited_at, accepted_at

**Friendship:** user_id, friend_id, status (pending/accepted), created_at

## Screens

| Screen | Purpose |
|--------|---------|
| Auth | Sign up and login |
| Home / Discover | Browse and filter public checklists |
| Checklist Detail | View items, owner, tags, copy and collaborate actions |
| Create/Edit | Title, description, items, tags, visibility, type picker |
| My Checklists | Tabs: Created, Copied, Collaborating |
| My Assigned Items | Cross-checklist view of everything assigned to the user |
| Friends | Friend list, pending requests, search and add |
| Profile | View and edit own profile |

### Navigation

- **Bottom tabs:** Discover, My Checklists, My Assigned Items, Profile
- Friends is accessible from Profile
- Create Checklist is a FAB or header action from My Checklists

## Project Structure

```
checklist-social/
├── app/                    # Expo Router file-based routes
│   ├── (tabs)/             # Bottom tab navigator
│   │   ├── discover.tsx    # Home / Discover screen
│   │   ├── my-lists.tsx    # My Checklists screen
│   │   ├── assigned.tsx    # My Assigned Items screen
│   │   └── profile.tsx     # Profile screen
│   ├── checklist/
│   │   ├── [id].tsx        # Checklist Detail screen
│   │   └── create.tsx      # Create/Edit screen
│   ├── friends.tsx         # Friends screen
│   └── auth.tsx            # Auth screen
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── checklist/          # Checklist-specific components
│   │   ├── ChecklistCard.tsx
│   │   ├── ChecklistItem.tsx
│   │   └── TypePicker.tsx  # Searchable multi-select combobox
│   ├── discovery/
│   │   └── FilterBar.tsx   # Type filter pills + expandable panel
│   └── collaboration/
│       └── AssigneeSelect.tsx
├── hooks/                  # Custom React hooks
├── services/               # API and backend integration
├── types/                  # TypeScript type definitions
├── constants/              # App constants (types list, countries)
├── utils/                  # Utility functions
└── assets/                 # Images, fonts, icons
```

## Getting Started

### Prerequisites
- Node.js 20+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

### Install

```bash
git clone https://github.com/your-username/checklist-social.git
cd checklist-social
npm install
```

### Run

```bash
# Start development server
npx expo start

# Run on iOS (requires development build, not Expo Go)
npx expo run:ios

# Run on Android
npx expo run:android
```

> **Note:** This project uses Expo SDK 57, which requires a development build (`expo-dev-client`). Expo Go may not support SDK 57 yet. Use `npx expo run:ios` or `npx expo run:android` to build locally, or use EAS Build for TestFlight/internal testing.

## Design

Three color palette directions are under consideration:

**Muted Earth:** Olive (#5E6E2E) and tan (#A3966A) with warm neutrals. Calm, grounded feel.

**New Botanicals:** Green (#16A34A) and dried-flower pink (#D4956B). Fresh, organic energy.

**Digital Neon:** Electric green (#00E87B), violet (#7C3AED), cyan (#06B6D4). Bold, modern, with glow effects on interactive elements.

All palettes follow the 60-30-10 rule and support both light and dark modes. Dark mode uses charcoal (#1E1E1E) rather than pure black.

## Roadmap

### Phase 2 (Post-MVP)
- Additional filters: gender, season, budget range
- Sort by popularity (most-copied)
- Friends-only visibility tier
- Like, save, and bookmark checklists
- "Used by X people" counter on checklist cards
- Comments on checklists

### Phase 3 (Polish and Retention)
- Activity feed showing friends' new and updated checklists
- Push notifications: item assigned, checklist copied, friend activity
- Real-time collaboration (live checkoff updates)
- Item-level comments and notes
- Share checklist to profile as a public highlight
- Voice assistant for checklist creation (speech-to-text, LLM intent parsing, confirmation flow)

## License

TBD
