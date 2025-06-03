//class for each player. player's have a name and a gameboard
class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
  }
}

module.exports = Player;
