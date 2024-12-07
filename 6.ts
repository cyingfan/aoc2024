import { getInput } from "./common";

const input = await getInput(6);

// Part 1
const grid = input.split("\n").map((line) => line.split(""));

const vectors = [
  (r: number, c: number) => <Coord>[r - 1, c], // up
  (r: number, c: number) => <Coord>[r, c + 1], // right
  (r: number, c: number) => <Coord>[r + 1, c], // down
  (r: number, c: number) => <Coord>[r, c - 1], // left
];

type Coord = [number, number];
const initialPosition = grid.reduce(
  (acc, row, rowIndex) => {
    const colIndex = row.indexOf("^");
    if (colIndex !== -1) {
      acc[0] = rowIndex;
      acc[1] = colIndex;
    }
    return acc;
  },
  <Coord>[-1, -1]
);
const initialVector = 0;
const markVisited = (r: number, c: number) => {
  grid[r][c] = "X";
}

const move = (position: Coord, vector: number): [Coord, number] | undefined => {
  const [newR, newC] = vectors[vector](position[0], position[1]);
  if (newR < 0 || newR >= grid.length || newC < 0 || newC >= grid[0].length) {
    return;
  }
  if (grid[newR][newC] === "#") {
    return move(position, (vector + 1) % 4);
  }
  markVisited(newR, newC);
  return [<Coord>[newR, newC], vector];
};

const moveAround = (initialPosition: Coord, initialVector: number) => {
  const result = move(initialPosition, initialVector);
  if (result) {
    moveAround(result[0], result[1]);
  }
};

markVisited(initialPosition[0], initialPosition[1]);
moveAround(initialPosition, initialVector);
console.log(grid.flat().filter((cell) => cell === "X").length);


// Part 2
const grid2 = input.split("\n").map((line) => line.split(""));

const emptyCells = grid2.reduce(
  (acc, row, rowIndex) =>
    row.reduce((acc2, cell, colIndex) =>
      <Coord[]>[...acc2, ...(cell === "." ? [[rowIndex, colIndex]] : [])], acc),
  <Coord[]>[]
).filter(([r, c]) => r !== initialPosition[0] || c !== initialPosition[1]);

type ObstructionMap = Record<string, number[]>;

const move2 = (position: Coord, vector: number, g: string[][], obstructionMap: ObstructionMap): boolean | [Coord, number] => {
  const [newR, newC] = vectors[vector](position[0], position[1]);
  if (newR < 0 || newR >= grid.length || newC < 0 || newC >= grid[0].length) {
    return false;
  }
  if (g[newR][newC] !== "#" && g[newR][newC] !== "O") {
    return [[newR, newC], vector];
  }
  const obstructionKey = [newR, newC].join(",");
  if (!(obstructionKey in obstructionMap) || obstructionMap[obstructionKey].indexOf(vector) === -1) {
    obstructionMap[obstructionKey] = (obstructionMap[obstructionKey] ?? []).concat(vector);
    return move2(position, (vector + 1) % 4, g, obstructionMap);
  }
  return true;
};

const doMoveAround2 = (g: string[][], obstructionMap: ObstructionMap, position: Coord, vector: number) => {
  const result = move2(position, vector, g, obstructionMap);
  if (typeof result !== "boolean") {
    return doMoveAround2(g, obstructionMap, result[0], result[1]);
  }
  return result;
};

const results = emptyCells.filter((cell) => {
  const g = grid2.map((row) => row.slice());
  g[cell[0]][cell[1]] = "O";
  const obstructionMap: ObstructionMap = {};
  return doMoveAround2(g, obstructionMap, initialPosition, initialVector);
});
console.log(results.length);
