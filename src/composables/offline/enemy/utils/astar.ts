import type { Cell, Position } from '@/types';

export function aStarPathfinding(
  start: Position,
  end: Position,
  dungeon: Cell[][],
  cellSize: number
): Position[] {
  const startCell = {
    x: Math.floor(start.x / cellSize),
    y: Math.floor(start.y / cellSize),
  };
  const endCell = {
    x: Math.floor(end.x / cellSize),
    y: Math.floor(end.y / cellSize),
  };

  const neighbors = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
  ];

  const heuristic = (a: Position, b: Position) => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  };

  const openList: any[] = [];
  const closedList: Set<string> = new Set();
  const cameFrom: Record<string, Position> = {};

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};

  openList.push(startCell);
  gScore[`${startCell.x},${startCell.y}`] = 0;
  fScore[`${startCell.x},${startCell.y}`] = heuristic(startCell, endCell);

  let iterations = 0;
  const maxIterations = 1000;

  while (openList.length > 0 && iterations < maxIterations) {
    let current = openList.reduce((prev, curr) => {
      return fScore[`${curr.x},${curr.y}`] < fScore[`${prev.x},${prev.y}`]
        ? curr
        : prev;
    });

    if (current.x === endCell.x && current.y === endCell.y) {
      let path: Position[] = [];
      while (cameFrom[`${current.x},${current.y}`]) {
        path.push(current);
        current = cameFrom[`${current.x},${current.y}`];
      }
      return path.reverse();
    }

    openList.splice(openList.indexOf(current), 1);
    closedList.add(`${current.x},${current.y}`);

    for (let neighbor of neighbors) {
      const neighborX = current.x + neighbor.x;
      const neighborY = current.y + neighbor.y;

      if (
        neighborX < 0 ||
        neighborY < 0 ||
        dungeon[neighborY][neighborX].cellType === 'wall' ||
        closedList.has(`${neighborX},${neighborY}`)
      ) {
        continue;
      }

      const tentativeGScore = gScore[`${current.x},${current.y}`] + 1;

      if (
        !openList.some((el) => el.x === neighborX && el.y === neighborY) ||
        tentativeGScore < gScore[`${neighborX},${neighborY}`]
      ) {
        cameFrom[`${neighborX},${neighborY}`] = current;
        gScore[`${neighborX},${neighborY}`] = tentativeGScore;
        fScore[`${neighborX},${neighborY}`] =
          gScore[`${neighborX},${neighborY}`] +
          heuristic({ x: neighborX, y: neighborY }, endCell);

        if (!openList.some((el) => el.x === neighborX && el.y === neighborY)) {
          openList.push({ x: neighborX, y: neighborY });
        }
      }
    }

    iterations++;
  }

  return iterations >= maxIterations ? [] : [];
}
