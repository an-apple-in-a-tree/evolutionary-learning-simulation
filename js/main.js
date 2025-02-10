let gridSize = 10;
let agent = new Agent(gridSize);

document.getElementById("train-btn").addEventListener("click", () => {
    agent.train(1000);
    updateAgentPosition(agent);
});

document.getElementById("reset-btn").addEventListener("click", () => {
    agent.position = { x: 0, y: 0 };
    updateAgentPosition(agent);
});

window.onload = () => {
    createGrid(gridSize);
    updateAgentPosition(agent);
};
