import { type Point, type Rectangle } from "./utils/geometry";
import { GameObject } from "./gameObjects";
import { type CodeProblem, type TestCase } from "./types";

export class PlayerShip extends GameObject {
  private input = "";
  private glowIntensity = 0;
  private readonly maxGlowIntensity = 0.5;
  private readonly glowFadeSpeed = 2;

  constructor(x: number, y: number) {
    super(x, y, 50, 50);
  }

  update(deltaTime: number): void {
    // Update glow effect
    this.glowIntensity = Math.max(
      0,
      this.glowIntensity - this.glowFadeSpeed * deltaTime
    );
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Draw glow effect
    if (this.glowIntensity > 0) {
      const gradient = ctx.createRadialGradient(
        this.x + this.width / 2,
        this.y + this.height / 2,
        0,
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width
      );
      gradient.addColorStop(
        0,
        `rgba(0, 255, 255, ${this.glowIntensity * 0.5})`
      );
      gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width * 2,
        this.height * 2
      );
    }

    // Draw a tower with dashed neon blue style
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Base
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Turret
    const turretWidth = this.width * 0.6;
    const turretHeight = this.height * 0.4;
    ctx.strokeRect(
      this.x + (this.width - turretWidth) / 2,
      this.y - turretHeight,
      turretWidth,
      turretHeight
    );

    // Reset dash pattern
    ctx.setLineDash([]);
  }

  handleInput(input: string): void {
    this.input = input;
    this.glowIntensity = this.maxGlowIntensity;
  }

  shoot(target: ProblemShip): Laser | null {
    try {
      if (this.validateSolution(this.input, target.getProblem())) {
        const startPos = this.getPosition();
        const targetPos = target.getPosition();
        // Shoot from the top of the turret
        return new Laser(
          startPos.x + this.width / 2,
          startPos.y - this.height * 0.4,
          targetPos
        );
      }
    } catch (error) {
      console.error("Code evaluation error:", error);
    }
    return null;
  }

  validateSolution(code: string, problem: CodeProblem): boolean {
    return problem.testCases.every((testCase: TestCase) => {
      try {
        // Prepare input values with proper string conversion for arrays
        const inputValues = Object.entries(testCase.input).map(([_, value]) => {
          if (Array.isArray(value)) {
            return JSON.stringify(value);
          }
          return value;
        });

        // Create a function with proper array handling
        const functionBody = `
          try {
            // Convert string arrays back to actual arrays
            ${Object.keys(testCase.input)
              .map((key, index) => {
                if (Array.isArray(testCase.input[key])) {
                  return `const ${key} = JSON.parse(arguments[${index}]);`;
                }
                return `const ${key} = arguments[${index}];`;
              })
              .join("\n")}

            return ${code};
          } catch (error) {
            throw new Error('Runtime error: ' + error.message);
          }
        `;

        const fn = new Function(functionBody);
        const result = fn.apply(null, inputValues);

        // Compare arrays properly
        const isEqual =
          Array.isArray(result) && Array.isArray(testCase.expected)
            ? JSON.stringify(result) === JSON.stringify(testCase.expected)
            : result === testCase.expected;

        return isEqual;
      } catch (error) {
        return false;
      }
    });
  }
}

export class ProblemShip extends GameObject {
  private difficulty: number;
  private speed: number;
  private readonly padding = 20;
  private readonly hitboxPadding = 15;
  private hitFlashTimer = 0;
  private readonly hitFlashDuration = 0.15; // seconds
  private pulsePhase = Math.random() * Math.PI * 2; // Random starting phase
  private readonly pulsePeriod = 2; // seconds per cycle
  private isTargeted = false;

  constructor(
    x: number,
    y: number,
    private problem: CodeProblem,
    baseSpeed: number
  ) {
    super(x, y, 100, 80);
    this.difficulty = problem.difficulty;
    this.speed = baseSpeed;
    this.calculateSize();
  }

  private calculateSize(): void {
    const ctx = document.createElement("canvas").getContext("2d")!;

    // Set fonts to measure text
    ctx.font = "14px monospace";
    const questionWidth = ctx.measureText(this.problem.question).width;

    ctx.font = "12px monospace";
    const varsString = Object.entries(this.problem.availableVars)
      .map(([name, type]) => `${name}: ${type}`)
      .join(", ");
    const varsWidth = ctx.measureText(varsString).width;

    // Calculate required width with padding
    this.width = Math.max(questionWidth, varsWidth) + this.padding * 2;

    // Height calculation: padding + question + spacing + variables + stars + padding
    this.height = this.padding + 20 + 15 + 20 + 20 + this.padding;
  }

  showHitFlash(): void {
    this.hitFlashTimer = this.hitFlashDuration;
  }

  update(deltaTime: number): void {
    // Move downward
    this.y += this.speed * deltaTime;

    // Update hit flash
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= deltaTime;
    }

    // Update pulse phase
    this.pulsePhase += (deltaTime * (Math.PI * 2)) / this.pulsePeriod;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const visualBounds = this.getVisualBounds();

    // Draw target highlight
    if (this.isTargeted) {
      ctx.save();
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      const padding = 5;
      ctx.strokeRect(
        visualBounds.x - padding,
        visualBounds.y - padding,
        visualBounds.width + padding * 2,
        visualBounds.height + padding * 2
      );
      ctx.restore();
    }

    // Draw pulsing glow based on difficulty
    const pulseIntensity = (Math.sin(this.pulsePhase) + 1) * 0.5 * 0.3;
    const glowColor = `rgba(255, 0, 0, ${
      (pulseIntensity * this.difficulty) / 3
    })`;
    ctx.fillStyle = glowColor;
    ctx.fillRect(
      visualBounds.x - 10,
      visualBounds.y - 10,
      visualBounds.width + 20,
      visualBounds.height + 20
    );

    // Draw hit flash effect
    if (this.hitFlashTimer > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${
        (this.hitFlashTimer / this.hitFlashDuration) * 0.5
      })`;
      ctx.fillRect(
        visualBounds.x,
        visualBounds.y,
        visualBounds.width,
        visualBounds.height
      );
    }

    // Draw dashed border
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      visualBounds.x,
      visualBounds.y,
      visualBounds.width,
      visualBounds.height
    );
    ctx.setLineDash([]);

    // Draw the problem text
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // Draw question
    ctx.fillText(
      this.problem.question,
      visualBounds.x + visualBounds.width / 2,
      visualBounds.y + this.padding
    );

    // Draw available variables
    const varStrings = Object.entries(this.problem.availableVars)
      .map(([name, type]) => `${name}: ${type}`)
      .join(", ");
    ctx.font = "12px monospace";
    ctx.fillText(
      varStrings,
      visualBounds.x + visualBounds.width / 2,
      visualBounds.y + this.padding + 35
    );

    // Draw difficulty stars
    ctx.font = "16px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(
      "⭐️".repeat(this.difficulty),
      visualBounds.x + this.padding,
      visualBounds.y + visualBounds.height - this.padding - 16
    );

    // Uncomment to debug hitbox
    // ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
    // ctx.setLineDash([2, 2]);
    // const hitbox = this.getBounds();
    // ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
  }

  getProblem(): CodeProblem {
    return this.problem;
  }

  getDifficulty(): number {
    return this.difficulty;
  }

  // Override getBounds to return a larger hitbox for collisions
  getBounds(): Rectangle {
    return {
      x: this.x - this.hitboxPadding,
      y: this.y - this.hitboxPadding,
      width: this.width + this.hitboxPadding * 2,
      height: this.height + this.hitboxPadding * 2,
    };
  }

  // Get the visual bounds (for drawing)
  getVisualBounds(): Rectangle {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  setTargeted(targeted: boolean): void {
    this.isTargeted = targeted;
  }
}

export class Laser extends GameObject {
  private readonly speed = 500;
  private dx: number;
  private dy: number;
  private angle: number;

  constructor(x: number, y: number, targetPos: Point) {
    super(x, y, 5, 20);

    this.angle = Math.atan2(targetPos.y - y, targetPos.x - x);
    this.dx = Math.cos(this.angle) * this.speed;
    this.dy = Math.sin(this.angle) * this.speed;
  }

  update(deltaTime: number): void {
    this.x += this.dx * deltaTime;
    this.y += this.dy * deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#ffffff";

    // Save context to rotate the laser
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.atan2(this.dy, this.dx));
    ctx.fillRect(0, -this.height / 2, this.width, this.height);
    ctx.restore();
  }

  getLaserLine() {
    const angle = Math.atan2(this.dy, this.dx);
    const length = 20; // Length of laser beam
    return {
      start: this.getPosition(),
      end: {
        x: this.x + Math.cos(angle) * length,
        y: this.y + Math.sin(angle) * length,
      },
    };
  }

  getAngle(): number {
    return this.angle;
  }
}
