# Antigravity & Gemini Project Instructions

## 1. Project Overview
This project is a real-time educational game application designed to help students prepare for the LGS (Turkish high school entrance exam). It features a multiplayer environment where a **Teacher** hosts a game room and **Students** join to solve questions based on specific rules (e.g., grammar topics). The system focuses on gamification with live scoring, leaderboards, and instant feedback.

**Non-goals**: This is not a full-fledged Learning Management System (LMS). It is a lightweight, session-based game tool.

## 2. Tech Stack
- **Frontend**: React 19 (JavaScript), built with Vite 7.
- **Styling**: Vanilla CSS (`App.css`, `index.css`). No heavy UI frameworks like Tailwind (unless explicitly added later).
- **Backend / Realtime**: Supabase (specifically Realtime Broadcast Channels for game state sync).
- **Hosting**: Firebase Hosting (inferred from `firebase.json`).
- **State Management**: React Context API (`RoomContext.jsx`).

## 3. Project Structure
```text
src/
├── components/       # UI Components and Game Screens
│   ├── games/        # Specific game logic components
│   ├── StudentScreen.jsx  # Main view for students
│   ├── TeacherScreen.jsx  # Main view for teachers
│   └── ...           # Selectors (Role, Grade, Topic)
├── context/
│   └── RoomContext.jsx    # CENTRAL LOGIC: State, Supabase Realtime, Scoring
├── data/             # Static data files (questions, rules)
├── supabase/
│   └── client.js     # Supabase client initialization
├── App.jsx           # Main entry point, handles navigation via state
└── main.jsx          # React root
```

**Entry Points**:
- **UI**: `src/App.jsx` (Determines view based on `role` state).
- **Logic**: `src/context/RoomContext.jsx` (Handles all game business logic and networking).

## 4. Domain & Data Model
**Key Entities**:
- **Room**: A temporary game session identified by a 4-digit code.
- **Student**:
  - `id`: UUID
  - `name`: Display name
  - `score`: Current total score
  - `lives`: Remaining lives (starts at 6)
  - `attempts`: Remaining attempts per turn
- **Rule (Game Round)**:
  - `kural`: The rule text
  - `dogruOrnek`: The correct answer string
  - `kartlar`: Array of options (cards) shown to students

**Data Flow**:
- Teacher selects Grade -> Topic -> Rule.
- **Events (Supabase Realtime)**:
  - `ogrenci_katildi`: Student joins.
  - `kural_geldi`: Teacher starts a round.
  - `cevap`: Student submits an answer.
  - `sure_bitti`: Timer ends.

## 5. How to Run & Develop
**Setup**:
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    - Currently, keys are hardcoded in `src/supabase/client.js`.
    - **TODO**: Move `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `.env` file.

**Running Locally**:
- Start dev server:
  ```bash
  npm run dev
  ```

**Linting**:
- Run ESLint:
  ```bash
  npm run lint
  ```

## 6. Coding Standards & Conventions for AI Assistants
**General Principles**:
- **State-Driven Navigation**: Do **NOT** add React Router. The app uses conditional rendering in `App.jsx` based on `role` and game state. Maintain this pattern.
- **Logic Placement**: Put game logic (scoring, networking) in `RoomContext.jsx`. Keep components purely presentational where possible.

**Naming & Language**:
- The codebase currently mixes English (component names, internal logic) and Turkish (event names, some variables like `kural`, `dogruOrnek`).
- **Convention**: Use **English** for new functions and variables. **Preserve Turkish** for existing data structures and Supabase event names (`kural_geldi`, `cevap`) to avoid breaking the protocol.

**Error Handling**:
- Fail gracefully in UI if Supabase connection drops.
- Log errors to console in development.

**Security**:
- **NEVER** output the hardcoded Supabase keys in chat.
- If modifying `client.js`, suggest moving keys to `import.meta.env`.

## 7. Forbidden & Sensitive Changes
- **Do NOT** change the names of Supabase Realtime events (`broadcast` channels) without updating both sender and receiver logic.
- **Do NOT** delete the `RoomContext` logic; it is the brain of the application.
- **Do NOT** switch to a different build tool (keep Vite).

## 8. TODOs / Gaps
- **Security**: The Supabase keys are currently hardcoded in `src/supabase/client.js`. They MUST be moved to a `.env` file (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- **Refactoring**: `RoomContext.jsx` is becoming a "God Object". Consider extracting specific logic (e.g., scoring) into utility functions in `src/utils/`.
