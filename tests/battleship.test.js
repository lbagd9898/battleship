const { Ship, Gameboard, Space } = require("../src/game/gameboard");

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

    console.log("Are any spaces already occupied?");
    spaces.forEach((space, i) => {
      console.log(`space[${i}] ship:`, space.ship);
    });
    result = gameboard.placeShip(ship, spaces);
  });

  test("placeship assigns ship to a space", () => {
    result.forEach((space) => {
      expect(space.ship).toBe(ship);
    });
  });

  test("error thrown if ship space already taken", () => {
    let otherShip = new Ship(2);
    let otherSpaces = [gameboard.spaces[0][1], gameboard.spaces[0][0]];
    expect(() => {
      gameboard.placeShip(otherShip, otherSpaces);
    }).toThrow("space taken");
  });

  test("if one space in ship placement is taken. all spaces remain shipless", () => {
    let otherShip = new Ship(2);
    let otherSpaces = [gameboard.spaces[0][1], gameboard.spaces[0][0]];
    try {
      gameboard.placeShip(otherShip, otherSpaces);
    } catch (err) {
      expect(err.message).toBe("space taken");
    }

    otherSpaces.forEach((space) => {
      expect(space.ship).not.toBe(otherShip);
    });
  });

  test.skip("takes  a pair of coordinates and determines if a ship is hit or not", () => {
    let hit = [1, 0];
    let miss = [4, 5];
    let hitResult = gameboard.receiveAttack(hit);
    let missResult = gameboard.receiveAttack(miss);

    expect(hitResult).toBe(ship);
    expect(missResult).toBe(null);
  });
});
