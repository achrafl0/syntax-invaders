import { type Point, type Rectangle } from "./utils/geometry";

export abstract class GameObject {
  constructor(
    protected x: number,
    protected y: number,
    protected width: number,
    protected height: number
  ) {}

  abstract update(deltaTime: number): void;
  abstract draw(ctx: CanvasRenderingContext2D): void;

  getPosition(): Point {
    return { x: this.x, y: this.y };
  }

  getBounds(): Rectangle {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
