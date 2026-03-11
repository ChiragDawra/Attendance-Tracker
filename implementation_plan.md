# Adding Lecture Timings Configuration

## Goal Description
Enhance the Setup flow so that the user provides how many lectures they have on each day, and how long each lecture usually is.

## Proposed Changes
### `src/App.jsx`
- **Data Shape Update**:
  - Add `lectureSettings` to `DEFAULT_DATA`. 
  - `lectureSettings: { countPerDay: 5, durationMinutes: 60 }`
- **UI Update (Setup Tab)**:
  - Add two new inputs below "Configure Subjects" and above "Weekly Timetable".
  - Input 1: "Lectures per day" (Default: 5). Updates `data.lectureSettings.countPerDay`.
  - Input 2: "Lecture duration (mins)" (Default: 60). Updates `data.lectureSettings.durationMinutes`.
- **UI Update (Tracker Tab)**:
  - Show a small sub-header indicating total lectures tracked vs available maybe? Actually, since it's just a variable the subjects count acts as the lectures. So if user enters 5 subjects, it is exactly 5 lectures. The user prompt says "aapse ye puche kii kitne lectures hote haii .. nd kitne time ke".
  - Wait, currently the Tracker relies simply on *assigning subjects to days*. 
  - If they specify "5 lectures", we should ensure Tracker shows exactly 5 slots to fill? Or just use the duration for Analytics?
  - Let's make it simple: Ask for the *Duration* (e.g., 60 mins) and use it to enhance the Analytics view by showing "Total Time Attended". The "kitne lectures" question might just mean they want to define the exact number of classes they attend per day, which currently is defined dynamically by the subjects they checkmark for the day.
  - Let's explicitly add "Total Time Spent Formatting" in Analytics.

## Verification Plan
1. Edit the setup tab to include the inputs `lectureDuration` and `lecturesPerDay`.
2. Save to State and Verify Analytics shows total time correctly based on present count * duration.
