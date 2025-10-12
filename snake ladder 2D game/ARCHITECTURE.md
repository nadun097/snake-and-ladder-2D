# 📂 Project Architecture Documentation

## 🎯 Purpose
This document explains the clean architecture implemented for the Snake and Ladder game, specifically designed to showcase **Data Structures & Algorithms** separate from game functionalities.

---

## 📁 Directory Structure

```
snake-and-ladder-2D/
│
├── index.html                      # Main HTML entry point
├── styles.css                      # Game styling
├── script.js                       # Bootstrap / Entry point
│

# ARCHITECTURE.md — Developer reference

This document maps the repository files to their responsibilities and shows how the data-structures module is separated from game logic. It's written for a developer (or grader) who needs to quickly find implementations, imports, and call flow.

---

## Quick summary
- Entry/UI: `index.html` + `script.js` (root)
- Canonical code: `src/`
  - `src/data-structures/` — pure DS & algorithms
  - `src/game/` — game-specific logic (core + config)
- Archived legacy files: `_old_structure/` — review before deletion

---

## Project layout (concise)

```
snake-and-ladder-2D/
├── index.html
├── styles.css
├── script.js                 # Entry, wires UI to src/ modules
├── src/
│   ├── data-structures/
│   │   ├── LinkedList.js
│   │   ├── Stack.js
│   │   ├── Sorting.js
│   │   └── README.md
│   └── game/
│       ├── core/
│       │   ├── GameController.js
│       │   ├── Board.js
│       │   └── Player.js
│       └── config/
│           └── gameConfig.js
├── images/
└── _old_structure/           # archived legacy files (safe to review)
```

---

## File-level map & usages
Each entry lists what the file exports/defines and who imports it.

### Root / UI
- `index.html` — page layout and DOM elements. Loads `script.js`.
- `styles.css` — styles for the UI; keep class names in sync with `index.html`.
- `script.js` — application bootstrap and DOM event wiring. Responsibilities:
  - create `Board` and `Game` (GameController)
  - create `Player` objects and pass them to the controller
  - call controller methods for dice roll, undo/redo, restart

  Typical calls:
  - `board = new Board()`
  - `game = new Game(board)`
  - `game.createPlayers(playerConfigs)`
  - `game.handlePlayerMove(playerIndex, diceValue)`

### `src/data-structures/` — pure implementations
These modules have no UI or game-specific code and are safe to reuse in other projects.

- `LinkedList.js`
  - Exports: `LinkedList`, `LinkedListNode`
  - Purpose: Doubly linked-list used by `Board` to model squares and traversal.
  - Imported by: `src/game/core/Board.js`

- `Stack.js`
  - Exports: `Stack`
  - Purpose: LIFO stack used for `Player` move history (undo/redo)
  - Imported by: `src/game/core/Player.js`

- `Sorting.js`
  - Exports: `sortByProperty` (and helpers)
  - Purpose: Sorting helper (stack-based insertion sort) used for leaderboards
  - Imported by: `src/game/core/GameController.js`


### `src/game/core/` — game logic (uses DS above)

- `Board.js`
  - Exports: `Board` class
  - Purpose: Build and manage board squares (uses `LinkedList`). Key methods:
    - `buildBoard()` / `insertSquare()`
    - `findSquare(position)`
    - `addPlayer(player, position)` / `removePlayer(player, position)`
    - `checkSquare(position)` — handles snakes and ladders mapping
  - Imported by: `script.js`, `GameController.js`

- `Player.js`
  - Exports: `Player` class
  - Purpose: Player model (name, avatar, position, wins) with `Stack`-backed history.
  - Key methods: `addMove()`, `undoMove()`, `redoMove()`, `resetHistory()`
  - Imported by: `script.js`, `GameController.js`

- `GameController.js` (often exported as `Game`)
  - Exports: `Game` / `GameController`
  - Purpose: Main game manager. Responsibilities:
    - create board and players
    - process moves (dice roll), apply snakes/ladders
    - record history for undo/redo
    - update leaderboard using `sortByProperty`
    - restart/exit logic
  - Imports: `Board`, `Player`, `sortByProperty`, `gameConfig`


### `src/game/config/gameConfig.js`
- Exports constants for the game: `snakes`, `ladders`, `diceImages`, `playerAvatars`, `rules`.
- Imported by Board, Player, GameController and `script.js`.


## Call graph & runtime flow (concise)

1. `index.html` loads `script.js`.
2. `script.js` instantiates `board = new Board()`.
3. `script.js` instantiates `game = new Game(board)` (GameController).
4. `script.js` creates `Player` objects and calls `game.createPlayers(players)`.
5. UI events -> `game.handlePlayerMove()`:
   - `Board.removePlayer()` / `Board.addPlayer()` to update positions
   - `Board.checkSquare()` for snakes/ladders
   - `Player.moveHistory.push()` records move (Stack)
6. `game.updateGridLeaderboard()` uses `sortByProperty()` to order players for the UI


## Quick-start for contributors

1. Open `index.html` in a browser or run Live Server.
2. Read `script.js` to see how UI events map to controller methods.
3. Inspect `src/data-structures/` to study DS implementations (LinkedList/Stack/Sorting).
4. Inspect `src/game/core/` to trace how DS are used in the game flow.


## Legacy files and housekeeping
- Legacy copies exist at project root (for example `new.js`, `Game.js`, `diceData.js`). They are archived under `_old_structure/` to avoid accidental use.
- Remove `_old_structure/` only after you verify the app is fully functional with `src/` modules.


## Small recommended improvements
- Remove empty or placeholder CSS rules in `styles.css` (some selectors are empty and flagged by linters).
- Add JSDoc or README examples in `src/data-structures/` to show usage and complexity.
- Add small unit tests for `LinkedList` and `Stack`.


---

If you'd like, I can now:
- generate `README_DS.md` into `src/data-structures/` with usage examples and complexity notes, or
- produce a dependency/flow diagram (`DIAGRAM.svg`) showing module imports.

Tell me which one you'd like next and I'll add it.

**Put in `game/ui/` if:**
- It manipulates the DOM

**Note:** The canonical, active implementations live under `src/data-structures/` and `src/game/core/`. Some legacy/duplicate files exist at the repository root (for example `new.js`, `Game.js`, and `diceData.js`) and have been archived in the `_old_structure/` folder to avoid confusion. You can delete `_old_structure/` after full verification if desired.
- Updates visual elements

#### `config/` - Configuration
- `gameConfig.js` - Game constants

Each data structure file should include:
- **Class description**
- **Time complexity** for each operation
- **Space complexity**
- **Usage examples**
- **No game-specific code**

Each game file should include:
- **Purpose in the game**
- **Which data structures it uses**
- **How it interacts with other modules**

---

**This architecture makes it crystal clear what's a data structure and what's game functionality!** 🎓✨
