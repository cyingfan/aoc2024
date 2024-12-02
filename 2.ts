import { getInput } from "./common";

const day = 2;
const input = await getInput(day);
const lines = input
  .split("\n")
  .filter(x => !!x)
  .map(x => x.split(" ").map(n => parseInt(n)));

/**
 * Part 1
 */
const calcDiffs = (line: number[]) =>
  line
    .slice(0, line.length - 1)
    .map((n, index) => n - line[index + 1]);

const filterRule = (line: number[]) =>
  line.every(n => Math.abs(n) >= 1 && Math.abs(n) <= 3) &&
  (line.every(n => n > 0) || line.every(n => n < 0));

const safeLines =
  lines
    .map(calcDiffs)
    .filter(filterRule);
console.log(safeLines.length);

/**
 * Part 2
 */
const generateCombinations = (line: number[]) => [
  line,
  ...line.map((_, index) => {
    let copy = [...line];
    copy.splice(index, 1);
    return copy;
  })
];

const isSafe = (line: number[]) =>
  generateCombinations(line)
    .map(calcDiffs)
    .some(filterRule);

const safeLines2 = lines.filter(isSafe);
console.log(safeLines2.length);

