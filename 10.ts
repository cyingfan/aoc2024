import { getInput, reduceSum } from "./common";

const input = await getInput(10);

const grid = input.split("\n").map((line) => line.split("").map(c => parseInt(c)));

// Part 1
type Coord = [number, number];
const findTrailHeads = (g: number[][]) => g.reduce(
  (acc, row, r) => row.reduce(
    (acc2, cell, c) => [...acc2, ...(cell === 0 ? [[r, c] as Coord] : [])],
    acc
  ),
  [] as Coord[]
);

const findNextMoves = (g: number[][], currentTrail: Coord[]): Coord[][] => {
  const [r, c] = currentTrail[currentTrail.length - 1];
  const current = g[r][c];
  const moves: Coord[] = [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]];
  const nextMoves = moves.filter(([r2, c2]) => g[r2]?.[c2] === current + 1);
  const nextTrails = nextMoves.map(([r2, c2]) => [...currentTrail, <Coord>[r2, c2]]);
  return [
    ...nextTrails.filter(t => t.length === 10),
    ...nextTrails.filter(t => t.length < 10).map(t => findNextMoves(g, t)).flat()
  ];
}


const findTrailHeadScores = (g: number[][], trailHead: Coord) => {
  const endCoods = findNextMoves(g, [trailHead]).map(t => t[t.length - 1].toString());
  return [...new Set(endCoods)].length;
}
console.log(findTrailHeads(grid).map(th => findTrailHeadScores(grid, th)).reduce(reduceSum));

// Part 2
console.log(
  findTrailHeads(grid)
    .map(th => findNextMoves(grid, [th]).length)
    .reduce(reduceSum)
);

