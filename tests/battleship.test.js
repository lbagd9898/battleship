const { Ship, Gameboard, Space } = require("../src/game/gameboard");
const Game = require("../src/game/game");

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

describe.skip("Gameboard", () => {
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
    // result = gameboard.placeShip(ship, spaces);
  });

  test.skip("placeship assigns ship to a space", () => {
    result.forEach((space) => {
      expect(space.ship).toBe(ship);
    });
  });

  test.skip("error thrown if ship space already taken", () => {
    let otherShip = new Ship(2);
    let otherSpaces = [gameboard.spaces[0][1], gameboard.spaces[0][0]];
    expect(() => {
      gameboard.placeShip(otherShip, otherSpaces);
    }).toThrow("space taken");
  });

  test.skip("if one space in ship placement is taken. all spaces remain shipless", () => {
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

  test.skip("ships are all successfully placed", () => {
    let shipPlaces = gameboard.randomlyPlaceShips();
    expect(Object.keys(shipPlaces)).toHaveLength(5);
  });

  test("all taken spaces are unique", () => {
    let shipPlaces = gameboard.randomlyPlaceShips();
    const allSpaces = Object.values(shipPlaces).flat();
    const coordStrings = allSpaces.map((space) => space.coordinates.join(","));

    const set = new Set(coordStrings);
    expect(set.size).toBe(coordStrings.length);
  });

  test.skip("spaces objects should be returned using coordinates", () => {
    const expectedSpace = gameboard.spaces[3][2]; // Coordinates [2, 3] => x = 2, y = 3

    const result = gameboard.getSpacesFromCoordinates([[2, 3]]); // Should return [expectedSpace]

    expect(result[0]).toBe(expectedSpace); // Use .toBe to check reference equality
  });
});
