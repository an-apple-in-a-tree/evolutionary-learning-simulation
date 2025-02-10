class QLearning {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.qTable = {};

        this.learningRate = 0.1;
        this.discountFactor = 0.9;
        this.epsilon = 0.2;

        this.actions = ["up", "down", "left", "right"];
        this.initQTable();
    }

    initQTable() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.qTable[`${r},${c}`] = { up: 0, down: 0, left: 0, right: 0 };
            }
        }
    }

    chooseAction(state) {
        if (Math.random() < this.epsilon) {
            return this.actions[Math.floor(Math.random() * this.actions.length)];
        }
        let actionValues = this.qTable[state];
        return Object.keys(actionValues).reduce((a, b) => actionValues[a] > actionValues[b] ? a : b);
    }

    updateQValue(state, action, reward, nextState) {
        let maxFutureQ = Math.max(...Object.values(this.qTable[nextState]));
        this.qTable[state][action] = (1 - this.learningRate) * this.qTable[state][action] +
            this.learningRate * (reward + this.discountFactor * maxFutureQ);
    }
}
