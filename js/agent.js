class Agent {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.position = { x: 0, y: 0 };
        this.goal = { x: gridSize - 1, y: gridSize - 1 };
        this.qLearning = new QLearning(gridSize, gridSize);
    }

    move(action) {
        let { x, y } = this.position;

        if (action === "up" && y > 0) y--;
        else if (action === "down" && y < this.gridSize - 1) y++;
        else if (action === "left" && x > 0) x--;
        else if (action === "right" && x < this.gridSize - 1) x++;

        this.position = { x, y };
    }

    getReward() {
        return this.position.x === this.goal.x && this.position.y === this.goal.y ? 100 : -1;
    }

    train(steps = 1000) {
        for (let i = 0; i < steps; i++) {
            let state = `${this.position.y},${this.position.x}`;
            let action = this.qLearning.chooseAction(state);

            this.move(action);

            let nextState = `${this.position.y},${this.position.x}`;
            let reward = this.getReward();
            this.qLearning.updateQValue(state, action, reward, nextState);

            if (reward === 100) {
                this.position = { x: 0, y: 0 };
            }
        }
    }
}
