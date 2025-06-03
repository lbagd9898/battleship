const { Ship, Gameboard, Space } = require("../src/game/battleship");

describe.skip("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(2);
  });

  test("is sunk before sunk", () => {
    expect(ship.isSunk()).toBe(false);
  });

  test("is sunk should be false after 1 hit", () => {
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test("is sunk should be true after 2 hits", () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});

describe("Gameboard", () => {
  let ship;
  let gameboard;
  let spaces;
  let result;

  beforeEach(() => {
    ship = new Ship(3);
    gameboard = new Gameboard();
    spaces = [
      gameboard.spaces[0][0],
      gameboard.spaces[1][0],
      gameboard.spaces[2][0],
    ];
    result = gameboard.placeShip(ship, spaces);
  });

  test("placeship assigns ship to a space", () => {
    result.forEach((space) => {
      expect(space.ship).toBe(ship);
    });
  });

  test("takes  a pair of coordinates and determines if a ship is hit or not", () => {
    let hit = [1, 0];
    let miss = [4, 5];
    let hitResult = gameboard.receiveAttack(hit);
    let missResult = gameboard.receiveAttack(miss);

    expect(hitResult).toBe(ship);
    expect(missResult).toBe(null);
  });
});
