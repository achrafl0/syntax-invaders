export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Line {
  start: Point;
  end: Point;
}

/**
 * Checks if a point is inside a rectangle
 */
export function isPointInRectangle(point: Point, rect: Rectangle): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * Checks if a line intersects with a rectangle by checking intersection with all sides
 * and if either endpoint is inside the rectangle
 */
export function doesLineIntersectRectangle(
  line: Line,
  rect: Rectangle
): boolean {
  // First check if either endpoint is inside the rectangle
  if (
    isPointInRectangle(line.start, rect) ||
    isPointInRectangle(line.end, rect)
  ) {
    return true;
  }

  // Create lines for all four sides of the rectangle
  const rectLines: Line[] = [
    // Left side
    {
      start: { x: rect.x, y: rect.y },
      end: { x: rect.x, y: rect.y + rect.height },
    },
    // Right side
    {
      start: { x: rect.x + rect.width, y: rect.y },
      end: { x: rect.x + rect.width, y: rect.y + rect.height },
    },
    // Top side
    {
      start: { x: rect.x, y: rect.y },
      end: { x: rect.x + rect.width, y: rect.y },
    },
    // Bottom side
    {
      start: { x: rect.x, y: rect.y + rect.height },
      end: { x: rect.x + rect.width, y: rect.y + rect.height },
    },
  ];

  // Check intersection with any of the rectangle's sides
  return rectLines.some((rectLine) => doLinesIntersect(line, rectLine));
}

/**
 * Checks if two line segments intersect
 * Uses the line-line intersection formula and checks if intersection point lies on both segments
 */
export function doLinesIntersect(line1: Line, line2: Line): boolean {
  const x1 = line1.start.x;
  const y1 = line1.start.y;
  const x2 = line1.end.x;
  const y2 = line1.end.y;
  const x3 = line2.start.x;
  const y3 = line2.start.y;
  const x4 = line2.end.x;
  const y4 = line2.end.y;

  // Calculate the denominator
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  // Lines are parallel or coincident
  if (denominator === 0) return false;

  // Calculate intersection parameters for both lines
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

  // Check if intersection point lies on both line segments
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

/**
 * Calculates the distance between two points
 */
export function getDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Finds a position for a rectangle that doesn't overlap with existing rectangles
 */
export function findNonOverlappingPosition(
  containerWidth: number,
  _containerHeight: number,
  rectWidth: number,
  rectHeight: number,
  existingRects: Rectangle[],
  minDistance: number,
  maxAttempts: number = 3
): Point | null {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Ensure margins from edges
    const margin = 20;
    const x = Math.max(
      margin,
      Math.random() * (containerWidth - rectWidth - margin * 2) + margin
    );
    const y = -rectHeight; // Start above the container

    // Check distance from all existing rectangles
    const isTooClose = existingRects.some((existing) => {
      const distance = Math.abs(x - existing.x);
      return distance < minDistance;
    });

    if (!isTooClose) {
      return { x, y };
    }
  }

  return null;
}
