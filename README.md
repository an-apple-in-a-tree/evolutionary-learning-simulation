# 🧠 Reinforcement Learning Agents Simulation

This is a JavaScript-based simulation that uses **Q-learning** and a **genetic algorithm** to evolve agents capable of navigating toward a goal on a canvas.

## 🎮 Demo

- Agents learn to move toward a green goal using simple discrete actions.
- Q-tables are evolved across generations via crossover and mutation.
- Each agent optimizes for a reward based on proximity to the goal and reaching it.

<p align="center">
  <img src="demo.gif" alt="Simulation demo" width="500"/>
</p>

## 🚀 Features

- **Canvas rendering** with directional agents and animated learning.
- **Reinforcement learning** via tabular Q-learning.
- **Genetic algorithm**:
  - Selection of top 20% of agents.
  - Q-table crossover and mutation to produce offspring.
- **Interactive UI**:
  - Start/stop simulation
  - Reset environment
  - Live generation counter

## 🧠 Agent Behavior

Each agent can:
- Move forward
- Turn left
- Turn right

### State Representation
State is defined by:
- **Angle segment** between agent direction and goal (8 bins)
- **Distance segment** to goal (3 bins)

### Reward Function
- Negative reward proportional to distance from the goal.
- +1000 bonus when agent reaches the goal.

## ⚙️ Parameters

| Parameter         | Value   |
|------------------|---------|
| Agents per generation | 50      |
| Generation duration   | 5 seconds |
| Mutation rate         | 10%     |
| Learning rate         | 0.1     |
| Discount factor       | 0.9     |
| Initial energy        | 200     |

## 🛠️ Tech Stack

- HTML5 `<canvas>`
- Vanilla JavaScript
- No libraries required

## 🧬 Files

- `index.html`: Basic structure and UI buttons.
- `main.js`: Contains logic for agent behavior, RL, and GA.
- `style.css`: (Optional) For minimal UI styling.

## 📦 Getting Started

Clone the repo and open `index.html` in your browser.

```bash
git clone https://github.com/yourusername/rl-agents-canvas.git
cd rl-agents-canvas
open index.html  # or double-click
