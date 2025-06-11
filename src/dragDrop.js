export function dragAndDrop() {
  const ship5 = document.querySelector("#ship5");
  const ships = document.querySelectorAll(".ship");
  const p1cells = Array.from(
    document.querySelectorAll(".cell[data-board='p1']")
  );
  const board = document.querySelector("#p1board");

  ships.forEach((ship) => {
    ship.addEventListener("dragstart", (event) => {
      console.log(event);
    });
  });

  ship5.addEventListener("dragstart", (event) => {
    console.log(event);
    console.log(p1cells);
  });

  let lastActiveCell = null;

  board.addEventListener("dragover", (e) => {
    e.preventDefault();

    const x = e.clientX;
    const y = e.clientY;

    let highlightedCells = [];

    const activeCell = p1cells.find((cell) => {
      const rect = cell.getBoundingClientRect();
      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    });

    //generate all highlighted cells in x-direction

    console.log(activeCell);

    let activeCellX = activeCell.dataset.x;
    let activeCellY = activeCell.dataset.y;

    console.log(activeCellX, activeCellY);

    if (activeCell !== lastActiveCell) {
      if (lastActiveCell) {
        lastActiveCell.classList.remove("dragenter");
      }

      if (activeCell) {
        activeCell.classList.add("dragenter");
      }
      lastActiveCell = activeCell;
    }
  });

  //when leaving board container, remove highlight
  board.addEventListener("dragleave", (e) => {
    if (lastActiveCell) {
      lastActiveCell.classList.remove("dragenter");
      lastActiveCell = null;
    }
  });
}
