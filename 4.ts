import { getInput } from "./common";

const day = 4;
const input = await getInput(day);

const grid = input
  .split("\n")
  .filter(x => !!x)
  .map(line => line.split(""));

const maxRow = grid.length;
const maxCol = grid[0].length;

/**
 * Part 1
 */
type WordVector = [[number, number], [number, number], [number, number], [number, number]];

const southVector = (r: number, c: number): WordVector => [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]];
const eastVector = (r: number, c: number): WordVector => [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]];
const northVector = (r: number, c: number): WordVector => [[r, c], [r - 1, c], [r - 2, c], [r - 3, c]];
const westVector = (r: number, c: number): WordVector => [[r, c], [r, c - 1], [r, c - 2], [r, c - 3]];
const southEastVector = (r: number, c: number): WordVector => [[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]];
const southWestVector = (r: number, c: number): WordVector => [[r, c], [r + 1, c - 1], [r + 2, c - 2], [r + 3, c - 3]];
const northEastVector = (r: number, c: number): WordVector => [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]];
const northWestVector = (r: number, c: number): WordVector => [[r, c], [r - 1, c - 1], [r - 2, c - 2], [r - 3, c - 3]];
const allVectors = [southVector, eastVector, northVector, westVector, southEastVector, southWestVector, northEastVector, northWestVector];
const validCoords = (r: number, c: number) => r >= 0 && r < maxRow && c >= 0 && c < maxCol;

const allCoords = [...Array(maxRow).keys()].map(r => [...Array(maxCol).keys()].map(c => [r, c])).flat();
const allWordVectors: WordVector[] = allCoords
  .map(([r, c]) => allVectors.map(v => v(r, c)))
  .flat()
  .filter(v => v.every(([r, c]) => validCoords(r, c)));
const isXmas = (v: WordVector) => v.map(([r, c]) => grid[r][c]).join("") === "XMAS";

console.log(allWordVectors.filter(isXmas).length);


/**
 * Part 2
 */
type XmasVector = [[number, number], [number, number], [number, number], [number, number], [number, number]];
const xVector = (r: number, c: number): XmasVector => [[r, c], [r - 1, c - 1], [r - 1, c + 1], [r + 1, c - 1], [r + 1, c + 1]];
const allXmasVectors: XmasVector[] = allCoords
  .map(([r, c]) => xVector(r, c))
  .filter(v => v.every(([r, c]) => validCoords(r, c)));
const isXmas2 = ([a, b, c, d, e]: XmasVector) =>
  grid[a[0]][a[1]] == "A" &&
  ((grid[b[0]][b[1]] == "M" && grid[e[0]][e[1]] == "S") || (grid[b[0]][b[1]] == "S" && grid[e[0]][e[1]] == "M")) &&
  ((grid[c[0]][c[1]] == "M" && grid[d[0]][d[1]] == "S") || (grid[c[0]][c[1]] == "S" && grid[d[0]][d[1]] == "M"));

console.log(allXmasVectors.filter(isXmas2).length);
