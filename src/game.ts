import { Renderer } from "./renderer";
import { ConsoleInput } from "./console";
import { PlayerShip, ProblemShip, Laser } from "./entities";
import { type Point } from "./utils/geometry";
import { ProblemGenerator } from "./problems";
import {
  doesLineIntersectRectangle,
  findNonOverlappingPosition,
} from "./utils/geometry";
import { ParticleSystem } from "./effects";

interface GameState {
  score: number;
  lives: number;
  isGameOver: boolean;
  maxDifficultyReached: number;
  gameStartTime: number;
  gameEndTime: number | null;
}

export class Game {
  private renderer: Renderer;
  private consoleInput: ConsoleInput;
  private player: PlayerShip;
  private enemies: ProblemShip[] = [];
  private lasers: Laser[] = [];
  private problemGenerator: ProblemGenerator;
  private lastTime: number = 0;
  private spawnTimer: number = 0;
  private readonly spawnInterval: number = 5;
  private readonly maxEnemies: number = 3;
  private particles: ParticleSystem;

  private state: GameState = {
    score: 0,
    lives: 3,
    isGameOver: false,
    maxDifficultyReached: 1,
    gameStartTime: Date.now(),
    gameEndTime: null,
  };

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.renderer = new Renderer(canvas);
    this.consoleInput = new ConsoleInput(canvas);
    this.problemGenerator = new ProblemGenerator();
    this.particles = new ParticleSystem();

    // Initialize player
    this.player = new PlayerShip(
      canvas.width / 2,
      canvas.height - this.consoleInput.getHeight() - 50
    );

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    (
      document.getElementById("gameCanvas") as HTMLCanvasElement
    ).addEventListener("click", this.handleClick.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (this.state.isGameOver) {
      this.handleRestart(event);
      return;
    }

    const input = this.consoleInput.handleKeyDown(event);
    if (input !== undefined) {
      this.handleCodeSubmission(input);
    }
  }

  private handleClick(event: MouseEvent): void {
    if (this.state.isGameOver) return;

    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.consoleInput.handleClick(x, y);
  }

  private handleCodeSubmission(code: string): void {
    this.player.handleInput(code);

    let foundValidTarget = false;
    for (const enemy of this.enemies) {
      const laser = this.player.shoot(enemy);
      if (laser) {
        this.lasers.push(laser);
        // Create shockwave at player's turret
        const playerPos = this.player.getPosition();
        this.particles.createShockwave(
          playerPos.x + this.player.getWidth() / 2,
          playerPos.y - this.player.getHeight() * 0.4
        );
        this.consoleInput.showSuccessFeedback();
        foundValidTarget = true;
        break;
      }
    }

    if (!foundValidTarget) {
      this.consoleInput.showErrorFeedback();
    }
  }

  private handleRestart(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.state = {
        score: 0,
        lives: 3,
        isGameOver: false,
        maxDifficultyReached: 1,
        gameStartTime: Date.now(),
        gameEndTime: null,
      };
      this.enemies = [];
      this.lasers = [];
      this.consoleInput = new ConsoleInput(
        document.getElementById("gameCanvas") as HTMLCanvasElement
      );
      event.preventDefault();
    }
  }

  private findGoodSpawnPosition(): Point | null {
    const tempProblem = this.problemGenerator.generateProblem(1);
    const baseSpeed = this.problemGenerator.getBaseSpeed(
      tempProblem.difficulty
    );
    const tempShip = new ProblemShip(0, 0, tempProblem, baseSpeed);
    const bounds = tempShip.getBounds();

    const existingRects = this.enemies.map((enemy) => enemy.getBounds());

    // Try multiple times with decreasing minimum distance
    const minDistances = [120, 80, 40];
    for (const minDistance of minDistances) {
      const position = findNonOverlappingPosition(
        this.renderer.getCanvas().width,
        this.renderer.getCanvas().height,
        bounds.width,
        bounds.height,
        existingRects,
        minDistance
      );
      if (position) return position;
    }
    return null;
  }

  private spawnProblemShip(): void {
    if (this.enemies.length >= this.maxEnemies) return;

    // Get currently active problems to avoid duplicates
    const activeProblems = new Set(
      this.enemies.map((enemy) => enemy.getProblem())
    );

    // Try to spawn a few times with different problems
    for (let attempts = 0; attempts < 5; attempts++) {
      const position = this.findGoodSpawnPosition();
      if (!position) continue;

      const problem = this.problemGenerator.generateProblem(this.state.score);

      // Skip if this problem is already on screen
      if (activeProblems.has(problem)) continue;

      const baseSpeed = this.problemGenerator.getBaseSpeed(problem.difficulty);
      this.enemies.push(
        new ProblemShip(position.x, position.y, problem, baseSpeed)
      );
      return;
    }
  }

  private checkCollisions(): void {
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const laser = this.lasers[i];
      const laserLine = laser.getLaserLine();

      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        if (doesLineIntersectRectangle(laserLine, enemy.getBounds())) {
          enemy.showHitFlash();
          this.problemGenerator.handleProblemSolved(enemy.getProblem());
          this.state.score += 2 * enemy.getDifficulty();

          // Create explosion at enemy position
          const enemyPos = enemy.getPosition();
          this.particles.createExplosion(
            enemyPos.x + enemy.getWidth() / 2,
            enemyPos.y + enemy.getHeight() / 2
          );

          setTimeout(() => {
            const index = this.enemies.indexOf(enemy);
            if (index > -1) {
              this.enemies.splice(index, 1);
            }
          }, 100);

          this.lasers.splice(i, 1);
          break;
        }
      }
    }
  }

  private checkGameOver(): void {
    if (this.state.lives <= 0 && !this.state.isGameOver) {
      this.state.isGameOver = true;
      this.state.gameEndTime = Date.now();
      this.consoleInput = new ConsoleInput(
        document.getElementById("gameCanvas") as HTMLCanvasElement,
        true
      );
    }
  }

  private update(deltaTime: number): void {
    if (this.state.isGameOver) return;

    // Update game objects
    this.consoleInput.update(deltaTime);
    this.player.update(deltaTime);
    this.enemies.forEach((enemy) => enemy.update(deltaTime));

    // Update lasers and create trails
    this.lasers.forEach((laser) => {
      laser.update(deltaTime);
      const pos = laser.getPosition();
      const angle = laser.getAngle();
      this.particles.createLaserTrail(pos.x, pos.y, angle);
    });

    // Update particles
    this.particles.update(deltaTime);

    // Spawn new problems
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnProblemShip();
      this.spawnTimer = 0;
    }

    // Check collisions
    this.checkCollisions();

    // Check for enemies passing the player
    const playerY =
      this.renderer.getCanvas().height - this.consoleInput.getHeight() - 50;

    // Check if any enemy has passed the player
    const enemyPassed = this.enemies.some(
      (enemy) => enemy.getPosition().y > playerY
    );

    if (enemyPassed) {
      // Mark all current problems as failed
      this.enemies.forEach((enemy) => {
        this.problemGenerator.handleProblemFailed(enemy.getProblem());
      });

      // Clear all enemies
      this.enemies = [];

      // Reduce life
      this.state.lives--;
      this.checkGameOver();

      // Reset spawn timer to give player a breather
      this.spawnTimer = 0;
    }

    // Update max difficulty
    this.enemies.forEach((enemy) => {
      this.state.maxDifficultyReached = Math.max(
        this.state.maxDifficultyReached,
        enemy.getDifficulty()
      );
    });

    // Clean up offscreen lasers
    this.lasers = this.lasers.filter((laser) => {
      const pos = laser.getPosition();
      const canvas = this.renderer.getCanvas();
      return (
        pos.x >= 0 &&
        pos.x <= canvas.width &&
        pos.y >= 0 &&
        pos.y <= canvas.height - this.consoleInput.getHeight()
      );
    });
  }

  private draw(): void {
    this.renderer.clear();

    // Draw particles behind game objects
    this.particles.draw(this.renderer.getContext());

    // Draw game objects
    this.renderer.drawGameObjects([
      this.player,
      ...this.enemies,
      ...this.lasers,
    ]);

    // Draw UI
    this.renderer.drawScore(this.state.score);
    this.renderer.drawLives(this.state.lives);
    this.renderer.drawAverageDifficulty(
      this.problemGenerator.getAverageDifficulty()
    );
    this.consoleInput.draw(this.renderer.getContext());

    // Draw game over screen
    if (this.state.isGameOver && this.state.gameEndTime) {
      const timeSurvived = Math.floor(
        (this.state.gameEndTime - this.state.gameStartTime) / 1000
      );
      const minutes = Math.floor(timeSurvived / 60);
      const seconds = timeSurvived % 60;
      const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      this.renderer.drawGameOver({
        timeString,
        maxDifficulty: this.state.maxDifficultyReached,
        score: this.state.score,
      });
    }
  }

  private gameLoop(timestamp: number): void {
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.draw();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  start(): void {
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}