# Supabase Integration Plan

This plan details the steps to fully integrate Supabase Auth and Database into the Attendance Tracker, ensuring 100% compliance with User Requirements.

## Proposed Changes

### `src/App.jsx`

#### Auth & Login Screen
- **Full-Screen Login**: Implement a full-screen dark-themed (#080c14) login page.
- **Branding**: Centered "MARKD" logo and "Mark · Track · Analyse" subtitle.
- **Login Options**: 
  - "Continue with Google" button.
  - Email/Password fields with "Sign In" and "Sign Up" actions.
- **Error Feedback**: Display login failure messages clearly.
- **Auth State Management**: Listen to `onAuthStateChange` to switch between main app and login screen.
- **Header Profile**: Show user avatar (from metadata) and name next to Logout.

#### Database Syncing
- **Initial Load**:
  - Fetch row from `attendance_data` where `user_id = user.id`.
  - If exists, load `subjects`, `timetable`, `attendance`, `daily_log`, and `phase`.
  - If not exists, insert a new empty row.
  - Fallback to LocalStorage if Supabase fetch fails.
- **Debounced Upsert**:
  - Triggered on changes to `subjects`, `timetable`, `attendance`, or `phase`.
  - 1-second debounce using `useRef` for timeout management.
  - Immediate LocalStorage save on every change.
- **Sync Status Dot**:
  - 🟡 Yellow pulsing: Syncing (debounce active).
  - 🟢 Green: Synced successfully.
  - 🔴 Red: Sync failed or offline.

#### Reset Functionality
- Clear LocalStorage immediately.
- Delete the user's row from Supabase: `supabase.from('attendance_data').delete().eq('user_id', user.id)`.
- Reset state to `DEFAULT_DATA`.

#### Loading State
- Centered teal ring CSS-only animated spinner with "Loading your data..." text.

#### Error Handling
- Wrap all Supabase calls in `try/catch`.
- Ensure the app stays functional (local mode) even if Supabase is unreachable.

## Verification
- Test all login/signup paths.
- Verify sync dot color transitions.
- Verify data persistence across sessions (cloud-first, local-fallback).
- Verify Hard Reset clears both local and remote data.
