import { type Point, type Rectangle } from "./utils/geometry";
import { type GameObject } from "./gameObjects";

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  clear(): void {
    this.ctx.fillStyle = "#0d1117";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawDashedRect(rect: Rectangle, color: string, lineWidth = 2): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    this.ctx.setLineDash([]);
  }

  drawText(
    text: string,
    position: Point,
    options: {
      color?: string;
      font?: string;
      align?: CanvasTextAlign;
      baseline?: CanvasTextBaseline;
    } = {}
  ): void {
    this.ctx.fillStyle = options.color || "#ffffff";
    this.ctx.font = options.font || "16px monospace";
    this.ctx.textAlign = options.align || "left";
    this.ctx.textBaseline = options.baseline || "top";
    this.ctx.fillText(text, position.x, position.y);
  }

  drawScore(score: number): void {
    this.drawText(
      `Score: ${score}`,
      { x: 10, y: 10 },
      {
        color: "#00ffff",
        font: "20px monospace",
      }
    );
  }

  drawLives(lives: number): void {
    this.drawText(
      "❤️".repeat(lives),
      { x: 10, y: 40 },
      {
        color: "#ff0000",
        font: "20px sans-serif",
      }
    );
  }

  drawAverageDifficulty(avgDifficulty: number): void {
    this.drawText(
      `Avg Difficulty: ${avgDifficulty.toFixed(1)}`,
      { x: 10, y: 70 },
      {
        color: "#ffff00",
        font: "16px monospace",
      }
    );
  }

  drawGameOver(stats: {
    timeString: string;
    maxDifficulty: number;
    score: number;
  }): void {
    // Semi-transparent overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const centerX = this.canvas.width / 2;
    const statsY = this.canvas.height / 2;
    const lineHeight = 40;

    // Game Over text
    this.drawText(
      "GAME OVER",
      { x: centerX, y: this.canvas.height / 3 },
      {
        color: "#ff0000",
        font: "48px monospace",
        align: "center",
        baseline: "middle",
      }
    );

    // Stats
    const statsStyle = {
      color: "#ffffff",
      font: "24px monospace",
      align: "center" as const,
      baseline: "middle" as const,
    };

    this.drawText(
      `Time Survived: ${stats.timeString}`,
      { x: centerX, y: statsY },
      statsStyle
    );
    this.drawText(
      `Max Difficulty: ${stats.maxDifficulty}`,
      { x: centerX, y: statsY + lineHeight },
      statsStyle
    );
    this.drawText(
      `Final Score: ${stats.score}`,
      { x: centerX, y: statsY + lineHeight * 2 },
      statsStyle
    );

    // Restart prompt
    this.drawText(
      "Press Enter to restart",
      { x: centerX, y: statsY + lineHeight * 4 },
      {
        color: "#ffffff",
        font: "20px monospace",
        align: "center",
        baseline: "middle",
      }
    );
  }

  drawGameObjects(objects: GameObject[]): void {
    objects.forEach((obj) => obj.draw(this.ctx));
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
