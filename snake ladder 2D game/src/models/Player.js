import { MoveHistory } from '../utils/MoveHistory.js';

/**
 * Player class representing a game player
 */
export class Player {
  constructor(name, color, image, id) {
    this.name = name;
    this.position = 0;
    this.rolledNumber = 0;
    this.color = color;
    this.image = image;
    this.id = id;
    this.moveHistory = new MoveHistory(7);
    this.wins = 0;
  }
}
