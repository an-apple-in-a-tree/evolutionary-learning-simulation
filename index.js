const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const genCounter = document.getElementById('genCounter');
let isSimulating = false;
let generation = 0;

// Simulation parameters
const NUM_AGENTS = 50;
const GENERATION_TIME = 5000; // 5 seconds per generation
const MUTATION_RATE = 0.1;
const LEARNING_RATE = 0.1;
const DISCOUNT_FACTOR = 0.9;
const INITIAL_ENERGY = 200;

// Environment elements
let agents = [];
let goals = [];
let obstacles = [];

class Agent {
    constructor(brain) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.direction = Math.random() * Math.PI * 2;
        this.speed = 2;
        this.energy = INITIAL_ENERGY;
        this.brain = brain ? brain.clone() : new QTable();
        this.fitness = 0;
    }

    update() {
        if (this.energy <= 0) return;

        const state = this.getState();
        const action = this.brain.chooseAction(state);
        this.performAction(action);

        const reward = this.calculateReward();
        const nextState = this.getState();
        this.brain.update(state, action, reward, nextState);

        this.energy = this.energy - 0.5;
        this.fitness += reward;

        this.checkGoalCollision();
    }

    getState() {
        const goal = goals[0];
        const dx = goal.x - this.x;
        const dy = goal.y - this.y;
        const angle = Math.atan2(dy, dx) - this.direction;
        const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const distance = Math.sqrt(dx*dx + dy*dy);

        const angleSegment = Math.floor(normalizedAngle / (Math.PI / 4)); // 8 segments
        const distanceSegment = Math.min(2, Math.floor(distance / 50)); // 3 segments
        return `${angleSegment},${distanceSegment}`;
    }

    performAction(action) {
        switch(action) {
            case 0: // Move forward
                this.x += Math.cos(this.direction) * this.speed;
                this.y += Math.sin(this.direction) * this.speed;
                break;
            case 1: // Turn left
                this.direction -= Math.PI / 8;
                break;
            case 2: // Turn right
                this.direction += Math.PI / 8;
                break;
        }
        this.x = Math.max(10, Math.min(canvas.width - 10, this.x));
        this.y = Math.max(10, Math.min(canvas.height - 10, this.y));
    }

    calculateReward() {
        const goal = goals[0];
        const dx = goal.x - this.x;
        const dy = goal.y - this.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        return -distance / 100; // Negative reward based on distance
    }

    checkGoalCollision() {
        const goal = goals[0];
        const dx = goal.x - this.x;
        const dy = goal.y - this.y;
        if (Math.sqrt(dx*dx + dy*dy) < 20) {
            this.fitness += 1000;
            this.energy = INITIAL_ENERGY;
            goal.x = Math.random() * (canvas.width - 40) + 20;
            goal.y = Math.random() * (canvas.height - 40) + 20;
        }
    }
}

class QTable {
    constructor() {
        this.table = {};
        this.learningRate = LEARNING_RATE;
        this.discount = DISCOUNT_FACTOR;
        this.epsilon = 0.2;
    }

    chooseAction(state) {
        if (!this.table[state]) this.initState(state);
        if (Math.random() < this.epsilon) {
            return Math.floor(Math.random() * 3);
        }
        return this.table[state].indexOf(Math.max(...this.table[state]));
    }

    update(state, action, reward, nextState) {
        if (!this.table[state]) this.initState(state);
        if (!this.table[nextState]) this.initState(nextState);

        const maxNext = Math.max(...this.table[nextState]);
        const current = this.table[state][action];
        this.table[state][action] = current + this.learningRate *
            (reward + this.discount * maxNext - current);
    }

    initState(state) {
        if (!this.table[state]) {
            this.table[state] = [0, 0, 0]; // Q-values for 3 actions
        }
    }

    clone() {
        const clone = new QTable();
        clone.learningRate = this.learningRate;
        clone.discount = this.discount;
        clone.epsilon = this.epsilon;
        for (const key in this.table) {
            clone.table[key] = [...this.table[key]];
        }
        return clone;
    }
}

// Genetic Algorithm functions
function createNewGeneration(oldAgents) {
    const parents = selectParents(oldAgents);
    const newAgents = [];

    while (newAgents.length < NUM_AGENTS) {
        const parent1 = parents[Math.floor(Math.random() * parents.length)];
        const parent2 = parents[Math.floor(Math.random() * parents.length)];
        let childBrain = crossover(parent1.brain, parent2.brain);
        childBrain = mutate(childBrain);
        newAgents.push(new Agent(childBrain));
    }

    generation++;
    genCounter.textContent = generation;
    return newAgents;
}

function selectParents(agents) {
    agents.sort((a, b) => b.fitness - a.fitness);
    return agents.slice(0, Math.floor(agents.length * 0.2));
}

function crossover(brain1, brain2) {
    const newBrain = new QTable();
    for (const state in brain1.table) {
        newBrain.table[state] = brain1.table[state].map((val, i) =>
            (val + (brain2.table[state]?.[i] || 0)) / 2
        );
    }
    return newBrain;
}

function mutate(brain) {
    for (const state in brain.table) {
        brain.table[state] = brain.table[state].map(val =>
            Math.random() < MUTATION_RATE ? val + (Math.random() - 0.5) : val
        );
    }
    return brain;
}

// Initialize simulation
function initSimulation() {
    agents = [];
    goals = [{ x: canvas.width/2, y: canvas.height/2 }];
    generation = 0;
    genCounter.textContent = generation;

    for (let i = 0; i < NUM_AGENTS; i++) {
        agents.push(new Agent());
    }
}

// Main loop
let lastGenTime = Date.now();
function simulate() {
    if (!isSimulating) return;

    const now = Date.now();
    if (now - lastGenTime > GENERATION_TIME) {
        agents = createNewGeneration(agents);
        lastGenTime = now;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw agents
    agents.forEach(agent => agent.update());
    agents = agents.filter(agent => agent.energy > 0);

    // Draw goals
    ctx.fillStyle = '#00ff00';
    goals.forEach(goal => {
        ctx.beginPath();
        ctx.arc(goal.x, goal.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw agents
    agents.forEach(agent => {
        ctx.fillStyle = `rgba(0, 0, 255, ${agent.energy/INITIAL_ENERGY})`;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw direction indicator
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(agent.x, agent.y);
        ctx.lineTo(
            agent.x + Math.cos(agent.direction) * 15,
            agent.y + Math.sin(agent.direction) * 15
        );
        ctx.stroke();
    });

    requestAnimationFrame(simulate);
}

// Event listeners
document.getElementById('startButton').addEventListener('click', () => {
    isSimulating = !isSimulating;
    document.getElementById('startButton').textContent =
        isSimulating ? 'Stop' : 'Start';
    if (isSimulating) simulate();
});

document.getElementById('resetButton').addEventListener('click', () => {
    isSimulating = false;
    document.getElementById('startButton').textContent = 'Start';
    initSimulation();
});

initSimulation();