import { getInput } from "./common";

const input = (await getInput(15))
  .replaceAll(/&lt;/g, "<")
  .replaceAll(/&gt;/g, ">")
  .replaceAll(/([\^v<>])\n([\^v<>])/g, "$1$2");

const [maze, moves] = input.split("\n\n");

type Coord = { r: number; c: number };

const moveMap: Record<string, Coord> = {
  "^": { r: -1, c: 0 },
  "v": { r: 1, c: 0 },
  "<": { r: 0, c: -1 },
  ">": { r: 0, c: 1 }
}

const makeGrid = (maze: string) => maze.split("\n").map(l => l.split(""));

const findBot = (grid: string[][]): Coord | undefined => {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] === "@") {
        return { r: x, c: y };
      }
    }
  }
};

const canPushBox = (grid: string[][], coord: Coord, vector: Coord): Coord | false => {
  const nextCoord = { r: coord.r + vector.r, c: coord.c + vector.c };
  if (grid[nextCoord.r][nextCoord.c] === "#") {
    return false;
  }
  if (grid[nextCoord.r][nextCoord.c] === ".") {
    return nextCoord;
  }
  return canPushBox(grid, nextCoord, vector);
};

const pushBox = (grid: string[][], emptyCellCoord: Coord, startCoord: Coord, vector: Coord) => {
  if (grid[emptyCellCoord.r][emptyCellCoord.c] !== ".") {
    throw new Error("Invalid empty cell position");
  }
  if (grid[startCoord.r][startCoord.c] !== "O") {
    throw new Error("Invalid box position");
  }
  const currentCoord = { r: emptyCellCoord.r, c: emptyCellCoord.c };
  const prevCoord = { r: emptyCellCoord.r - vector.r, c: emptyCellCoord.c - vector.c };
  while (currentCoord.r !== startCoord.r || currentCoord.c !== startCoord.c) {
    [grid[currentCoord.r][currentCoord.c], grid[prevCoord.r][prevCoord.c]] = [grid[prevCoord.r][prevCoord.c], grid[currentCoord.r][currentCoord.c]];
    currentCoord.r = prevCoord.r;
    currentCoord.c = prevCoord.c;
    prevCoord.r -= vector.r;
    prevCoord.c -= vector.c;
  }
};

const moveBot = (grid: string[][], bot: Coord, move: string) => {
  if (grid[bot.r][bot.c] !== "@") {
    throw new Error(`Invalid bot position ${bot.r}, ${bot.c} ${move} `);
  }
  if (!moveMap[move]) {
    throw new Error("Invalid move");
  }
  const nextCoord = { r: bot.r + moveMap[move].r, c: bot.c + moveMap[move].c };
  switch (grid[nextCoord.r][nextCoord.c]) {
    case ".":
      grid[bot.r][bot.c] = ".";
      grid[nextCoord.r][nextCoord.c] = "@";
      return nextCoord;

    case "O":
      const emptyCellCoord = canPushBox(grid, nextCoord, moveMap[move]);
      if (emptyCellCoord) {
        pushBox(grid, emptyCellCoord, nextCoord, moveMap[move]);
        grid[bot.r][bot.c] = ".";
        grid[nextCoord.r][nextCoord.c] = "@";
        return nextCoord;
      }
      return bot;

    default:
      return bot;
  }
};

const travel = (grid: string[][], bot: Coord) => {
  moves.split("").forEach(m => {
    bot = moveBot(grid, bot, m);
  });
};

const calcScores = (grid: string[][]) => {
  let sum = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] === "O") {
        sum += (x * 100) + y;
      }
    }
  }
  return sum;
};

// Part 1
const grid1 = makeGrid(maze);
let bot = <Coord>findBot(grid1);
travel(grid1, bot);
console.log(calcScores(grid1));


// Part 2
const resizeGrid = (grid: string[][]) => {
  const tempGrid = structuredClone(grid);
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      switch (grid[x][y]) {
        case ".":
          tempGrid[x][y] = "..";
          break;
        case "#":
          tempGrid[x][y] = "##";
          break;
        case "@":
          tempGrid[x][y] = "@.";
          break;
        case "O":
          tempGrid[x][y] = "[]";
          break;
      }
    }
  }
  return tempGrid.map(l => l.join("").split(""));
}

const canPushHorizontal = canPushBox;

const pushHorizontal = (grid: string[][], emptyCellCoord: Coord, startCoord: Coord, vector: Coord) => {
  if (grid[emptyCellCoord.r][emptyCellCoord.c] !== ".") {
    throw new Error("Invalid empty cell position");
  }
  if (grid[startCoord.r][startCoord.c] !== "[" && grid[startCoord.r][startCoord.c] !== "]") {
    throw new Error("Invalid box position");
  }
  const currentCoord = { r: emptyCellCoord.r, c: emptyCellCoord.c };
  const prevCoord = { r: emptyCellCoord.r - vector.r, c: emptyCellCoord.c - vector.c };
  while (currentCoord.r !== startCoord.r || currentCoord.c !== startCoord.c) {
    [grid[currentCoord.r][currentCoord.c], grid[prevCoord.r][prevCoord.c]] = [grid[prevCoord.r][prevCoord.c], grid[currentCoord.r][currentCoord.c]];
    currentCoord.r = prevCoord.r;
    currentCoord.c = prevCoord.c;
    prevCoord.r -= vector.r;
    prevCoord.c -= vector.c;
  }
};


const canPushVertical = (grid: string[][], vector: Coord, moveStack: Coord[][] = []): Coord[][] => {
  if (moveStack.length === 0) {
    throw new Error("Invalid move stack");
  }
  const coords = moveStack[0];
  if (!coords.every(c => grid[c.r][c.c] === "[" || grid[c.r][c.c] === "]")) {
    throw new Error("Invalid box position");
  }
  const nextCoords = coords.map(c => {
    const nextCoord = { r: c.r + vector.r, c: c.c + vector.c };
    if (grid[c.r][c.c] === "[" && grid[nextCoord.r][nextCoord.c] === "]") {
      return [nextCoord, { r: nextCoord.r, c: nextCoord.c - 1 }];
    }
    if (grid[c.r][c.c] === "]" && grid[nextCoord.r][nextCoord.c] === "[") {
      return [nextCoord, { r: nextCoord.r, c: nextCoord.c + 1 }];
    }
    return nextCoord;
  })
    .flat()
    .reduce(
      (acc, c) => {
        if (acc.every(a => a.r !== c.r || a.c !== c.c)) {
          acc.push(c);
        }
        return acc;
      },
      [] as Coord[]
    );

  if (nextCoords.some(c => grid[c.r][c.c] === "#")) {
    return [];
  }
  if (nextCoords.every(c => grid[c.r][c.c] === ".")) {
    return moveStack;
  }
  moveStack.unshift(nextCoords.filter(c => grid[c.r][c.c] === "[" || grid[c.r][c.c] === "]"));
  return canPushVertical(grid, vector, moveStack);
};

const pushVertical = (grid: string[][], moveStack: Coord[][], vector: Coord) => {

  moveStack.forEach(coords => {
    coords.forEach((coord) => {
      const newCoord = { r: coord.r + vector.r, c: coord.c + vector.c };
      [grid[coord.r][coord.c], grid[newCoord.r][newCoord.c]] = [grid[newCoord.r][newCoord.c], grid[coord.r][coord.c]];
    });
  })
}

const moveBot2 = (grid: string[][], bot: Coord, move: string) => {
  if (grid[bot.r][bot.c] !== "@") {
    throw new Error(`Invalid bot position ${bot.r}, ${bot.c} ${move} `);
  }
  if (!moveMap[move]) {
    throw new Error("Invalid move");
  }
  const nextCoord = { r: bot.r + moveMap[move].r, c: bot.c + moveMap[move].c };
  switch (grid[nextCoord.r][nextCoord.c]) {
    case ".":
      grid[bot.r][bot.c] = ".";
      grid[nextCoord.r][nextCoord.c] = "@";
      return nextCoord;

    case "[":
    case "]":
      const isHorizontal = moveMap[move].r === 0;
      if (isHorizontal) {
        const emptyCellCoord = canPushHorizontal(grid, nextCoord, moveMap[move]);
        if (emptyCellCoord) {
          pushHorizontal(grid, emptyCellCoord, nextCoord, moveMap[move]);
          grid[bot.r][bot.c] = ".";
          grid[nextCoord.r][nextCoord.c] = "@";
          return nextCoord;
        }
      } else {
        const coords = grid[nextCoord.r][nextCoord.c] === "[" ?
          [nextCoord, { r: nextCoord.r, c: nextCoord.c + 1 }] :
          [nextCoord, { r: nextCoord.r, c: nextCoord.c - 1 }];
        const moveStack = canPushVertical(grid, moveMap[move], [coords]);
        if (moveStack.length > 0) {
          pushVertical(grid, moveStack, moveMap[move]);
          grid[bot.r][bot.c] = ".";
          grid[nextCoord.r][nextCoord.c] = "@";
          return nextCoord;
        }
      }
      return bot;

    default:
      return bot;
  }
};

const travel2 = (grid: string[][], bot: Coord) => {
  moves.split("").forEach(m => {
    bot = moveBot2(grid, bot, m);
  });
};

const calcScores2 = (grid: string[][]) => {
  let sum = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] === "[") {
        sum += (x * 100) + y;
      }
    }
  }
  return sum;
};

// Part 2
const grid2 = resizeGrid(makeGrid(maze));
bot = <Coord>findBot(grid2);
travel2(grid2, bot);
console.log(calcScores2(grid2));


