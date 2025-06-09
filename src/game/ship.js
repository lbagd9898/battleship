//Represents a ship placed on battleship board
class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
  }

  //Increments when ship is hit
  hit() {
    this.hits += 1;
    return this.hits;
  }

  //once ship is hit the same number of times as length, it is sunk
  isSunk() {
    return this.hits >= this.length;
  }
}

module.exports = Ship;
