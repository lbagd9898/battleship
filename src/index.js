import "./styles.css";

document.addEventListener("DOMContentLoaded", () => {
  //create grid to represent p1's board
  const p1board = document.querySelector("#p1board");
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.board = "p1";
      cell.dataset.x = j;
      cell.dataset.y = i;
      cell.textContent = `${j}, ${i}`;
      p1board.append(cell);
    }
  }
  //create grid to represent p2's board
  const p2board = document.querySelector("#p2board");
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.board = "p2";
      cell.dataset.x = j;
      cell.dataset.y = i;
      cell.textContent = `${j}, ${i}`;
      p2board.append(cell);
    }
  }
});
