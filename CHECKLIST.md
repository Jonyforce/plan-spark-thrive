# ✅ Development Checklist: Plan Spark Thrive

## Phase 1: User Data Collection (UI + Input Functionality)
- [x] Design schema for user_activity, daily_summaries, learning_retention
- [x] Create RLS policies and triggers for secure access
- [ ] Connect PostgreSQL database to the app (supabase or custom server)
- [ ] Create UI for users to input:
  - [ ] Progress by project/study item
  - [ ] Daily summaries (mood, energy, motivation)
  - [ ] Study retention/confidence updates
- [ ] Create lightweight state manager for handling daily user updates

## Phase 2: Structured & Scalable Storage
- [ ] Ensure scalable indexing and referencing across tables
- [ ] Add ability to tag or categorize activities (labels like: focus, flow, distraction)
- [ ] Setup data export options (CSV, JSON)
- [ ] Prepare Supabase Functions/API routes for each key DB operation

## Phase 3: Data Analysis & Visualization
- [ ] Daily/weekly/monthly productivity trendline
- [ ] Heatmap for study/motivation/energy
- [ ] Yearly timeline of all projects/goals
- [ ] Modular visualization layer with pluggable charting lib (e.g. Recharts, Chart.js)
- [ ] AI Suggestions Module (based on performance pattern)

---

## 🗂️ Branch Workflow Status
- Base Branch: `main`
- Current Dev Branch: `ts30_chatgpt_branch`
- Updates will be merged into `main` after verified, bug-free integration.

---

## Progress Tracking Table
| Step | Description | Status |
|------|-------------|--------|
| 1 | DB schema and policies added | ✅ |
| 2 | Connect DB to frontend UI | 🚧 |
| 3 | Visualization phase (drafting) | ⏳ |