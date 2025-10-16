# Snake and Ladder 2D Game

A classic Snake and Ladder board game built with HTML, CSS, and JavaScript featuring clean code organization and data structures.

## 📁 Project Structure

```
snake-and-ladder-2D/
│
├── index.html              # Main HTML file
├── styles.css              # Game styling
├── script.js               # Main entry point and UI controller
│
├── src/                    # Source code directory
│   ├── Game.js            # Main game controller
│   │
│   ├── models/            # Data structure classes
│   │   ├── Board.js       # Board with Linked List structure
│   │   └── Player.js      # Player entity class
│   │
│   ├── utils/             # Utility classes
│   │   └── MoveHistory.js # Stack-based move history (Undo/Redo)
│   │
│   └── config/            # Configuration files
│       └── gameConfig.js  # Game constants and settings
│
└── images/                # Game assets

```

## 🎮 Features

- **1-4 Player Modes**: Play solo against computer or with friends
- **Difficulty Levels**: Easy, Medium, and Hard modes
- **Undo/Redo**: Stack-based move history (up to 3 moves)
- **Leaderboards**: Track wins and current positions
- **Visual Feedback**: Animated dice rolls and player movements

## 🔧 Data Structures Used

### 1. **Linked List** (Board.js)
- Represents the game board as a doubly-linked list
- Each node contains square position and snake/ladder connections
- Efficient traversal for checking snakes and ladders

### 2. **Stack** (MoveHistory.js)
- Two stacks for undo/redo functionality
- `historyStack`: Stores completed moves
- `redoStack`: Stores undone moves for redo
- Limited to 7 moves in history, 3 undo/redo per turn

### 3. **Stack-based Sorting** (Game.js - updateGridLeaderboard)
- Uses stack-based insertion sort algorithm
- Sorts players by board position
- Demonstrates stack operations for sorting

## 🚀 Getting Started

1. Open `index.html` in a web browser
2. Click "PLAY" to start
3. Select game mode (1-4 players)
4. Enter player names
5. Choose difficulty level
6. Roll the dice and enjoy!

## 🎯 Game Rules

### Starting
- Roll a 6 to enter the board

### Movement
- Roll the dice to move forward
- Land on a ladder to climb up
- Land on a snake to slide down
- Roll a 6 to get an extra turn

### Winning
- **Easy**: Land on or past square 100
- **Medium**: Land on or below square 100
- **Hard**: Land exactly on square 100 (bounce back if over)

## 🛠️ Code Organization

### src/models/
Contains data structure classes:
- `Board`: Manages the game board using linked list
- `Player`: Represents player state and properties

### src/utils/
Contains utility classes:
- `MoveHistory`: Stack-based undo/redo system

### src/config/
Contains configuration:
- `gameConfig`: All game constants (images, colors, rules)

### src/Game.js
Main game controller with organized sections:
- Board Management
- Player Management  
- Game Logic
- Undo/Redo Functionality
- Game State Management
- UI Updates

## 🎨 Key Classes

### Board
```javascript
- insertSquare()          // Add square to linked list
- handleInsertSquare()    // Add square with snake/ladder check
- findSquare()           // Traverse list to find square
- deleteNodePlayer()     // Remove player from square
- addPlayers()          // Add player to square
```

### MoveHistory
```javascript
- addMove()    // Push move to history stack
- undo()       // Pop from history, push to redo
- redo()       // Pop from redo, push to history
- reset()      // Clear both stacks
```

### Game
```javascript
- createGameBoard()          // Render visual board
- handlePlayerMove()         // Process dice roll and movement
- checkWin()                // Check win conditions
- checkForLaddersOrSnakes() // Apply snake/ladder effects
- undoMove() / redoMove()   // Undo/redo functionality
- updateLeaderboard()       // Update win leaderboard
- updateGridLeaderboard()   // Stack-based position sorting
```

## 📝 Notes

- All game functionalities are preserved from the original version
- Code is organized for easy understanding and maintenance
- Comments explain data structure implementations
- Configuration is separated for easy customization

## 🔄 Future Enhancements

- Add more snake/ladder patterns
- Implement save/load game state
- Add animation effects
- Multiplayer online mode
- Mobile responsive design improvements

---

**Enjoy the game! 🎲🐍🪜**
