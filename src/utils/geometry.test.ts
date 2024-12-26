import { describe, it, expect } from "vitest";
import {
  isPointInRectangle,
  doesLineIntersectRectangle,
  doLinesIntersect,
  getDistance,
  findNonOverlappingPosition,
  type Point,
  type Rectangle,
  type Line,
} from "./geometry";

describe("isPointInRectangle", () => {
  const rect: Rectangle = { x: 10, y: 10, width: 20, height: 20 };

  it("should return true for points inside the rectangle", () => {
    const points: Point[] = [
      { x: 15, y: 15 }, // Center
      { x: 10, y: 10 }, // Top-left corner
      { x: 30, y: 30 }, // Bottom-right corner
    ];

    points.forEach((point) => {
      expect(isPointInRectangle(point, rect)).toBe(true);
    });
  });

  it("should return false for points outside the rectangle", () => {
    const points: Point[] = [
      { x: 5, y: 15 }, // Left
      { x: 35, y: 15 }, // Right
      { x: 15, y: 5 }, // Above
      { x: 15, y: 35 }, // Below
    ];

    points.forEach((point) => {
      expect(isPointInRectangle(point, rect)).toBe(false);
    });
  });
});

describe("doLinesIntersect", () => {
  it("should return true for intersecting lines", () => {
    const line1: Line = {
      start: { x: 0, y: 0 },
      end: { x: 10, y: 10 },
    };
    const line2: Line = {
      start: { x: 0, y: 10 },
      end: { x: 10, y: 0 },
    };

    expect(doLinesIntersect(line1, line2)).toBe(true);
  });

  it("should return false for parallel lines", () => {
    const line1: Line = {
      start: { x: 0, y: 0 },
      end: { x: 10, y: 10 },
    };
    const line2: Line = {
      start: { x: 0, y: 1 },
      end: { x: 10, y: 11 },
    };

    expect(doLinesIntersect(line1, line2)).toBe(false);
  });

  it("should return false for non-intersecting lines", () => {
    const line1: Line = {
      start: { x: 0, y: 0 },
      end: { x: 5, y: 5 },
    };
    const line2: Line = {
      start: { x: 6, y: 6 },
      end: { x: 10, y: 10 },
    };

    expect(doLinesIntersect(line1, line2)).toBe(false);
  });
});

describe("doesLineIntersectRectangle", () => {
  const rect: Rectangle = { x: 10, y: 10, width: 20, height: 20 };

  it("should return true for lines intersecting the rectangle", () => {
    const lines: Line[] = [
      { start: { x: 0, y: 0 }, end: { x: 30, y: 30 } }, // Diagonal through rectangle
      { start: { x: 20, y: 0 }, end: { x: 20, y: 40 } }, // Vertical through rectangle
      { start: { x: 0, y: 20 }, end: { x: 40, y: 20 } }, // Horizontal through rectangle
    ];

    lines.forEach((line) => {
      expect(doesLineIntersectRectangle(line, rect)).toBe(true);
    });
  });

  it("should return false for lines not intersecting the rectangle", () => {
    const lines: Line[] = [
      { start: { x: 0, y: 0 }, end: { x: 5, y: 5 } }, // Outside left-top
      { start: { x: 35, y: 35 }, end: { x: 40, y: 40 } }, // Outside right-bottom
      { start: { x: 0, y: 40 }, end: { x: 40, y: 40 } }, // Below rectangle
    ];

    lines.forEach((line) => {
      expect(doesLineIntersectRectangle(line, rect)).toBe(false);
    });
  });
});

describe("getDistance", () => {
  it("should calculate correct distance between points", () => {
    const testCases = [
      {
        point1: { x: 0, y: 0 },
        point2: { x: 3, y: 4 },
        expected: 5, // 3-4-5 triangle
      },
      {
        point1: { x: 1, y: 1 },
        point2: { x: 1, y: 2 },
        expected: 1, // Vertical line
      },
      {
        point1: { x: 1, y: 1 },
        point2: { x: 2, y: 1 },
        expected: 1, // Horizontal line
      },
    ];

    testCases.forEach(({ point1, point2, expected }) => {
      expect(getDistance(point1, point2)).toBe(expected);
    });
  });
});

describe("findNonOverlappingPosition", () => {
  it("should find a valid position when space is available", () => {
    const containerWidth = 800;
    const containerHeight = 600;
    const rectWidth = 50;
    const rectHeight = 50;
    const existingRects: Rectangle[] = [
      { x: 100, y: 100, width: 50, height: 50 },
    ];
    const minDistance = 100;

    const position = findNonOverlappingPosition(
      containerWidth,
      containerHeight,
      rectWidth,
      rectHeight,
      existingRects,
      minDistance
    );

    expect(position).not.toBeNull();
    if (position) {
      expect(position.x).toBeGreaterThanOrEqual(20); // margin
      expect(position.x).toBeLessThanOrEqual(containerWidth - rectWidth - 20);
      expect(position.y).toBe(-rectHeight);
    }
  });

  it("should return null when no valid position is found", () => {
    const containerWidth = 100;
    const containerHeight = 100;
    const rectWidth = 30;
    const rectHeight = 30;
    const existingRects: Rectangle[] = [
      { x: 20, y: 0, width: 30, height: 30 },
      { x: 60, y: 0, width: 30, height: 30 },
    ];
    const minDistance = 50;

    const position = findNonOverlappingPosition(
      containerWidth,
      containerHeight,
      rectWidth,
      rectHeight,
      existingRects,
      minDistance,
      1 // Only one attempt to make test deterministic
    );

    expect(position).toBeNull();
  });
});
