# Supabase Integration Walkthrough

The Attendance Tracker has been upgraded with a complete Supabase backend for authentication and data persistence.

## Changes Made

### 1. Premium Authentication Shell
- **Full-Screen Login**: A new dark-themed login page (#080c14) with centered branding.
- **Branding**: Added "MARKD" logo and "Mark · Track · Analyse" subtitle.
- **Multiple Auth Paths**: Includes Email/Password inputs (Sign In/Up) and a "Continue with Google" button.
- **Loading State**: A teal ring CSS-only spinner appears while fetching initial user data.

### 2. Robust Data Sync Engine
- **Debounced Cloud Save**: Changes to subjects, timetable, or attendance are automatically synced to Supabase after 1 second of inactivity to minimize API calls.
- **Sync Status Indicator**: A small pulsing dot in the header provides real-time feedback:
  - 🟢 **Green / Cyan**: Data is perfectly synced.
  - 🟡 **Yellow**: Syncing in progress (debounce timer running).
  - 🔴 **Red**: Sync error or offline mode.
- **Offline First**: All changes are saved to `localStorage` immediately. If the cloud is unreachable, the app functions silently using local data.

### 3. User Experience Enhancements
- **Header Profile**: Displaying the user's avatar and name/email in the top-right corner.
- **Hard Reset**: The RESET button now wipes both local data and the remote Supabase row.
- **Error Handling**: All Supabase calls are wrapped in `try/catch` to ensure the app never crashes due to network issues.

## How to Test
1. **Login**: Sign up with a test email or use Google.
2. **Setup**: Add a few subjects and a timetable. Watch the **Yellow dot** appear while typing, and turn **Green** after you stop.
3. **Data Persistence**: Refresh the page. Your data will be fetched from the cloud.
4. **Offline Mode**: Try disconnecting your internet; the sync dot will turn **Red**, but your data will still save to `localStorage`.
5. **Reset**: Click RESET and confirm. Both local and cloud data will be cleared.
