import SeedGenerator from './seedGenerator';
import { Cell, Room, DungeonGeneratorConfig } from '@/types';

const floorImages = Array.from({ length: 4 }, (_, i) => `floor${i + 1}.png`);

class DungeonGenerator {
  private static WALL: Cell = { cellType: 'wall' };
  private static EMPTY: Cell = { cellType: 'empty' };

  private static ROWS: number;
  private static COLS: number;
  private static MAXSIZE: number;
  private static MINSIZE: number;
  private static BORDER: number;
  private static ATTEMPTS: number;
  private static ROOMS: number;

  private static rooms: Room[] = [];
  private static rng: SeedGenerator | null = null;

  private static classifyWalls(floorMap: Cell[][]) {
    const isFloor = (row: number, col: number) => {
      return (
        row >= 0 &&
        col >= 0 &&
        row < this.ROWS &&
        col < this.COLS &&
        floorMap[row][col].cellType === 'empty'
      );
    };

    const isWall = (row: number, col: number) => {
      return (
        row >= 0 &&
        col >= 0 &&
        row < this.ROWS &&
        col < this.COLS &&
        floorMap[row][col].cellType === 'wall'
      );
    };

    for (let i = 0; i < this.ROWS; i++) {
      for (let j = 0; j < this.COLS; j++) {
        if (floorMap[i][j].cellType === 'wall') {
          const top = isFloor(i - 1, j);
          const bottom = isFloor(i + 1, j);
          const left = isFloor(i, j - 1);
          const right = isFloor(i, j + 1);
          const topLeft = isFloor(i - 1, j - 1);
          const topRight = isFloor(i - 1, j + 1);
          const bottomLeft = isFloor(i + 1, j - 1);
          const bottomRight = isFloor(i + 1, j + 1);

          if (
            isWall(i - 1, j) &&
            isWall(i, j - 1) &&
            topLeft &&
            !top &&
            !left
          ) {
            floorMap[i][j].wallType = 'innerCornerTopLeft';
          } else if (
            isWall(i - 1, j) &&
            isWall(i, j + 1) &&
            topRight &&
            !top &&
            !right
          ) {
            floorMap[i][j].wallType = 'innerCornerTopRight';
          } else if (
            isWall(i + 1, j) &&
            isWall(i, j - 1) &&
            bottomLeft &&
            !bottom &&
            !left
          ) {
            floorMap[i][j].wallType = 'innerCornerBottomLeft';
          } else if (
            isWall(i + 1, j) &&
            isWall(i, j + 1) &&
            bottomRight &&
            !bottom &&
            !right
          ) {
            floorMap[i][j].wallType = 'innerCornerBottomRight';
          } else if (top && bottom && left && right) {
            floorMap[i][j].wallType = 'crossWall';
          } else if (top && bottom && !left && !right) {
            floorMap[i][j].wallType = 'verticalWall';
          } else if (left && right && !top && !bottom) {
            floorMap[i][j].wallType = 'horizontalWall';
          } else if (top && left && !bottomRight) {
            floorMap[i][j].wallType = 'cornerTopLeft';
          } else if (top && right && !bottomLeft) {
            floorMap[i][j].wallType = 'cornerTopRight';
          } else if (bottom && left && !topRight) {
            floorMap[i][j].wallType = 'cornerBottomLeft';
          } else if (bottom && right && !topLeft) {
            floorMap[i][j].wallType = 'cornerBottomRight';
          } else if (top && bottom) {
            if (left) {
              floorMap[i][j].wallType = 'verticalEndLeft';
            } else if (right) {
              floorMap[i][j].wallType = 'verticalEndRight';
            } else {
              floorMap[i][j].wallType = 'verticalEnd';
            }
          } else if (left && right) {
            if (top) {
              floorMap[i][j].wallType = 'horizontalEndTop';
            } else if (bottom) {
              floorMap[i][j].wallType = 'horizontalEndBottom';
            } else {
              floorMap[i][j].wallType = 'horizontalEnd';
            }
          } else if (top) {
            floorMap[i][j].wallType = 'topWall';
          } else if (bottom) {
            floorMap[i][j].wallType = 'bottomWall';
          } else if (left) {
            floorMap[i][j].wallType = 'leftWall';
          } else if (right) {
            floorMap[i][j].wallType = 'rightWall';
          }
        }
      }
    }
  }

  private static isNotOverlapping(floorMap: Cell[][], room: Room): boolean {
    for (let i = room.row - 1; i < room.row + room.h + 1; i++) {
      for (let j = room.col - 1; j < room.col + room.w + 1; j++) {
        if (floorMap[i][j].cellType !== DungeonGenerator.WALL.cellType) {
          return false;
        }
      }
    }
    return true;
  }

  private static linkStraightH(floorMap: Cell[][], r1: Room, r2: Room) {
    const inc = r1.col < r2.col ? 1 : -1;
    for (let i = r1.col; i !== r2.col; i += inc) {
      floorMap[r1.row][i] = { ...DungeonGenerator.EMPTY };
      floorMap[r1.row + 1][i] = { ...DungeonGenerator.EMPTY };
    }
  }

  private static linkStraightV(floorMap: Cell[][], r1: Room, r2: Room) {
    const inc = r1.row < r2.row ? 1 : -1;
    for (let i = r1.row; i !== r2.row; i += inc) {
      floorMap[i][r1.col] = { ...DungeonGenerator.EMPTY };
      floorMap[i][r1.col + 1] = { ...DungeonGenerator.EMPTY };
    }
  }

  private static link2Steps(floorMap: Cell[][], r1: Room, r2: Room): boolean {
    const flipCoin = this.rng
      ? Math.floor(this.rng.nextFloat() * 2)
      : Math.floor(Math.random() * 2);
    if (r1.row > r2.row && r1.col > r2.col) {
      if (flipCoin) {
        for (let i = r1.row - 1; i >= r2.row + r2.h - 1; i--) {
          floorMap[i][r1.col] = { ...DungeonGenerator.EMPTY };
          floorMap[i][r1.col + 1] = { ...DungeonGenerator.EMPTY };
        }
        for (let i = r1.col - 1; i >= r2.col + r2.w; i--) {
          floorMap[r2.row + r2.h - 1][i] = { ...DungeonGenerator.EMPTY };
          floorMap[r2.row + r2.h - 2][i] = { ...DungeonGenerator.EMPTY };
        }
      } else {
        for (let i = r1.col - 1; i >= r2.col + r2.w - 1; i--) {
          floorMap[r1.row][i] = { ...DungeonGenerator.EMPTY };
          floorMap[r1.row + 1][i] = { ...DungeonGenerator.EMPTY };
        }
        for (let i = r1.row - 1; i >= r2.row + r2.h; i--) {
          floorMap[i][r2.col + r2.w - 1] = { ...DungeonGenerator.EMPTY };
          floorMap[i][r2.col + r2.w - 2] = { ...DungeonGenerator.EMPTY };
        }
      }
    } else if (r1.row > r2.row && r1.col < r2.col) {
      if (flipCoin) {
        for (let i = r1.row - 1; i >= r2.row + r2.h - 1; i--) {
          floorMap[i][r1.col + r1.w - 1] = { ...DungeonGenerator.EMPTY };
          floorMap[i][r1.col + r1.w] = { ...DungeonGenerator.EMPTY };
        }
        for (let i = r1.col + r1.w; i < r2.col; i++) {
          floorMap[r2.row + r2.h - 1][i] = { ...DungeonGenerator.EMPTY };
          floorMap[r2.row + r2.h - 2][i] = { ...DungeonGenerator.EMPTY };
        }
      } else {
        for (let i = r1.col + r1.w; i <= r2.col; i++) {
          floorMap[r1.row][i] = { ...DungeonGenerator.EMPTY };
          floorMap[r1.row + 1][i] = { ...DungeonGenerator.EMPTY };
        }
        for (let i = r1.row - 1; i >= r2.row + r2.h; i--) {
          floorMap[i][r2.col] = { ...DungeonGenerator.EMPTY };
          floorMap[i][r2.col + 1] = { ...DungeonGenerator.EMPTY };
        }
      }
    } else {
      return false;
    }
    return true;
  }

  private static linkRooms(floorMap: Cell[][], r1: Room, r2: Room) {
    if (r1.row >= r2.row && r1.row < r2.row + r2.h) {
      DungeonGenerator.linkStraightH(floorMap, r1, r2);
    } else if (r2.row >= r1.row && r2.row < r1.row + r1.h) {
      DungeonGenerator.linkStraightH(floorMap, r2, r1);
    } else if (r1.col >= r2.col && r1.col < r2.col + r2.w) {
      DungeonGenerator.linkStraightV(floorMap, r1, r2);
    } else if (r2.col >= r1.col && r2.col < r1.col + r1.w) {
      DungeonGenerator.linkStraightV(floorMap, r2, r1);
    } else {
      if (!DungeonGenerator.link2Steps(floorMap, r1, r2)) {
        DungeonGenerator.link2Steps(floorMap, r2, r1);
      }
    }
  }

  private static randomEvenOdd(min: number, max: number): number {
    if (max === min) return max;
    const randomValue = this.rng ? this.rng.nextFloat() : Math.random();
    return min + Math.floor(randomValue * Math.floor((max - min) / 2 + 1)) * 2;
  }

  private static addRoom(floorMap: Cell[][]): Room | undefined {
    const h = DungeonGenerator.randomEvenOdd(
      DungeonGenerator.MINSIZE,
      DungeonGenerator.MAXSIZE
    );
    const w = DungeonGenerator.randomEvenOdd(
      DungeonGenerator.MINSIZE,
      DungeonGenerator.MAXSIZE
    );
    const room: Room = {
      h,
      w,
      row:
        DungeonGenerator.randomEvenOdd(
          0,
          DungeonGenerator.ROWS - h - 2 * DungeonGenerator.BORDER
        ) + DungeonGenerator.BORDER,
      col:
        DungeonGenerator.randomEvenOdd(
          0,
          DungeonGenerator.COLS - w - 2 * DungeonGenerator.BORDER
        ) + DungeonGenerator.BORDER,
    };

    if (DungeonGenerator.isNotOverlapping(floorMap, room)) {
      for (let i = room.row; i < room.row + room.h; i++) {
        for (let j = room.col; j < room.col + room.w; j++) {
          floorMap[i][j] = { ...DungeonGenerator.EMPTY };
        }
      }
      return room;
    }
    return undefined;
  }

  private static distance(a: Room, b: Room): number {
    const d2 = Math.pow(b.row - a.row, 2) + Math.pow(b.col - a.col, 2);
    return Math.sqrt(d2);
  }

  public static generate(
    config: DungeonGeneratorConfig = {},
    seed?: number
  ): Cell[][] {
    DungeonGenerator.ROWS = config.rows || 31;
    DungeonGenerator.COLS = config.cols || 51;
    DungeonGenerator.MAXSIZE = config.maxRoomSize || 7;
    DungeonGenerator.MINSIZE = config.minRoomSize || 3;
    DungeonGenerator.BORDER = config.padding || 2;
    DungeonGenerator.ATTEMPTS = config.maxAttempts || 500;
    DungeonGenerator.ROOMS = config.rooms || 15;

    if (seed !== undefined) {
      DungeonGenerator.rng = new SeedGenerator(seed);
    } else {
      DungeonGenerator.rng = null;
    }

    const floorMap: Cell[][] = [];
    for (let i = 0; i < DungeonGenerator.ROWS; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < DungeonGenerator.COLS; j++) {
        row.push({ ...DungeonGenerator.WALL });
      }
      floorMap.push(row);
    }

    const roomsToLink: Room[] = [];
    const roomsLinked: Room[] = [];
    let i = 0;
    let r = 0;
    while (i < DungeonGenerator.ATTEMPTS && r < DungeonGenerator.ROOMS) {
      const newRoom = DungeonGenerator.addRoom(floorMap);
      if (newRoom) {
        roomsToLink.push(newRoom);
        r++;
      }
      i++;
    }

    roomsLinked.push(roomsToLink.pop()!);
    while (roomsToLink.length) {
      const r1 = roomsLinked[roomsLinked.length - 1];
      const r2 = roomsToLink
        .sort(
          (a, b) =>
            DungeonGenerator.distance(r1, a) - DungeonGenerator.distance(r1, b)
        )
        .pop()!;
      DungeonGenerator.linkRooms(floorMap, r1, r2);
      roomsLinked.push(r2);
    }

    this.rooms = roomsLinked;

    DungeonGenerator.classifyWalls(floorMap);

    return floorMap.map((row) =>
      row.map((cell) => ({
        ...cell,
        floorImage:
          cell.cellType === DungeonGenerator.WALL.cellType
            ? ''
            : floorImages[Math.floor(Math.random() * floorImages.length)],
      }))
    );
  }

  public static getSpawnPoint(): { x: number; y: number } | undefined {
    if (this.rooms.length > 0) {
      const room = this.rooms[0];
      return {
        x: (room.col + Math.floor(room.w / 2)) * 20,
        y: (room.row + Math.floor(room.h / 2)) * 20,
      };
    }
    return undefined;
  }
}

export default DungeonGenerator;
