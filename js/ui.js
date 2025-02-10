function createGrid(gridSize) {
    let grid = document.getElementById("grid");
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
    grid.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            if (x === gridSize - 1 && y === gridSize - 1) {
                cell.classList.add("goal");
            }
            cell.dataset.x = x;
            cell.dataset.y = y;
            grid.appendChild(cell);
        }
    }
}

function updateAgentPosition(agent) {
    document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("agent"));

    let cell = document.querySelector(`[data-x="${agent.position.x}"][data-y="${agent.position.y}"]`);
    if (cell) cell.classList.add("agent");
}
