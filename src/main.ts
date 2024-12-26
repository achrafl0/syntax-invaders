import "./style.css";
import { Game } from "./game";

// Create and setup canvas
const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <div class="game-container">
    <canvas id="gameCanvas"></canvas>
  </div>
`;

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
canvas.width = 1000;
canvas.height = 650;

// Initialize and start the game
const game = new Game("gameCanvas");
game.start();
