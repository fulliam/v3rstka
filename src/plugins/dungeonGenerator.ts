type CellType = 'W' | 'E';
type Cell = { cellType: 'wall' | 'empty' };

interface Room {
  h: number;
  w: number;
  row: number;
  col: number;
}

interface Config {
  rows?: number;
  cols?: number;
  maxRoomSize?: number;
  minRoomSize?: number;
  padding?: number;
  maxAttempts?: number;
  rooms?: number;
}

class DungeonGenerator {
  private static WALL: CellType = 'W';
  private static EMPTY: CellType = 'E';

  private static ROWS: number;
  private static COLS: number;
  private static MAXSIZE: number;
  private static MINSIZE: number;
  private static BORDER: number;
  private static ATTEMPTS: number;
  private static ROOMS: number;

  private static rooms: Room[] = [];

  private static isNotOverlapping(floorMap: CellType[][], room: Room): boolean {
    for (let i = room.row - 1; i < room.row + room.h + 1; i++) {
      for (let j = room.col - 1; j < room.col + room.w + 1; j++) {
        if (floorMap[i][j] !== DungeonGenerator.WALL) {
          return false;
        }
      }
    }
    return true;
  }

  private static linkStraightH(floorMap: CellType[][], r1: Room, r2: Room) {
    const inc = r1.col < r2.col ? 1 : -1;
    for (let i = r1.col; i !== r2.col; i += inc) {
      floorMap[r1.row][i] = DungeonGenerator.EMPTY;
    }
  }

  private static linkStraightV(floorMap: CellType[][], r1: Room, r2: Room) {
    const inc = r1.row < r2.row ? 1 : -1;
    for (let i = r1.row; i !== r2.row; i += inc) {
      floorMap[i][r1.col] = DungeonGenerator.EMPTY;
    }
  }

  private static link2Steps(floorMap: CellType[][], r1: Room, r2: Room): boolean {
    const flipCoin = Math.floor(Math.random() * 2);
    if (r1.row > r2.row && r1.col > r2.col) {
      if (flipCoin) {
        for (let i = r1.row - 1; i >= r2.row + r2.h - 1; i--) {
          floorMap[i][r1.col] = DungeonGenerator.EMPTY;
        }
        for (let i = r1.col - 1; i >= r2.col + r2.w; i--) {
          floorMap[r2.row + r2.h - 1][i] = DungeonGenerator.EMPTY;
        }
      } else {
        for (let i = r1.col - 1; i >= r2.col + r2.w - 1; i--) {
          floorMap[r1.row][i] = DungeonGenerator.EMPTY;
        }
        for (let i = r1.row - 1; i >= r2.row + r2.h; i--) {
          floorMap[i][r2.col + r2.w - 1] = DungeonGenerator.EMPTY;
        }
      }
    } else if (r1.row > r2.row && r1.col < r2.col) {
      if (flipCoin) {
        for (let i = r1.row - 1; i >= r2.row + r2.h - 1; i--) {
          floorMap[i][r1.col + r1.w - 1] = DungeonGenerator.EMPTY;
        }
        for (let i = r1.col + r1.w; i < r2.col; i++) {
          floorMap[r2.row + r2.h - 1][i] = DungeonGenerator.EMPTY;
        }
      } else {
        for (let i = r1.col + r1.w; i <= r2.col; i++) {
          floorMap[r1.row][i] = DungeonGenerator.EMPTY;
        }
        for (let i = r1.row - 1; i >= r2.row + r2.h; i--) {
          floorMap[i][r2.col] = DungeonGenerator.EMPTY;
        }
      }
    } else {
      return false;
    }
    return true;
  }

  private static linkRooms(floorMap: CellType[][], r1: Room, r2: Room) {
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
    return min + Math.floor(Math.random() * Math.floor((max - min) / 2 + 1)) * 2;
  }

  private static addRoom(floorMap: CellType[][]): Room | undefined {
    const h = DungeonGenerator.randomEvenOdd(DungeonGenerator.MINSIZE, DungeonGenerator.MAXSIZE);
    const w = DungeonGenerator.randomEvenOdd(DungeonGenerator.MINSIZE, DungeonGenerator.MAXSIZE);
    const room: Room = {
      h,
      w,
      row: DungeonGenerator.randomEvenOdd(0, DungeonGenerator.ROWS - h - 2 * DungeonGenerator.BORDER) + DungeonGenerator.BORDER,
      col: DungeonGenerator.randomEvenOdd(0, DungeonGenerator.COLS - w - 2 * DungeonGenerator.BORDER) + DungeonGenerator.BORDER,
    };

    if (DungeonGenerator.isNotOverlapping(floorMap, room)) {
      for (let i = room.row; i < room.row + room.h; i++) {
        for (let j = room.col; j < room.col + room.w; j++) {
          floorMap[i][j] = DungeonGenerator.EMPTY;
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

  public static generate(config: Config = {}): Cell[][] {
    DungeonGenerator.ROWS = config.rows || 31;
    DungeonGenerator.COLS = config.cols || 51;
    DungeonGenerator.MAXSIZE = config.maxRoomSize || 7;
    DungeonGenerator.MINSIZE = config.minRoomSize || 3;
    DungeonGenerator.BORDER = config.padding || 2;
    DungeonGenerator.ATTEMPTS = config.maxAttempts || 500;
    DungeonGenerator.ROOMS = config.rooms || 15;

    const floorMap: CellType[][] = [];
    for (let i = 0; i < DungeonGenerator.ROWS; i++) {
      const row: CellType[] = [];
      for (let j = 0; j < DungeonGenerator.COLS; j++) {
        row.push(DungeonGenerator.WALL);
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
      const r2 = roomsToLink.sort((a, b) => DungeonGenerator.distance(r1, a) - DungeonGenerator.distance(r1, b)).pop()!;
      DungeonGenerator.linkRooms(floorMap, r1, r2);
      roomsLinked.push(r2);
    }

    this.rooms = roomsLinked;

    return floorMap.map(row =>
      row.map(cell => ({
        cellType: cell === DungeonGenerator.WALL ? 'wall' : 'empty',
      }))
    );
  }

  public static getSpawnPoint(): { x: number, y: number } | undefined {
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
