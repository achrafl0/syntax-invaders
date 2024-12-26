import { type Point, type Rectangle } from "./utils/geometry";

export class GameObject {
  constructor(
    protected x: number,
    protected y: number,
    protected width: number,
    protected height: number
  ) {}

  getPosition(): Point {
    return { x: this.x, y: this.y };
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getBounds(): Rectangle {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  update(_deltaTime: number): void {
    // Base update method, to be overridden by child classes
  }

  draw(_ctx: CanvasRenderingContext2D): void {
    // Base draw method, to be overridden by child classes
  }
}
