import { getInput } from "./common";

const day = 8;
const input = (await getInput(day)).replace(/#/g, ".");

// Part 1
type Coord = [number, number];
const grid = input.split("\n").map(l => l.split(""));
const maxRow = grid.length;
const maxCol = grid[0].length;

const getAntinodeVector = (current: Coord, compare: Coord) => {
  const n = [compare[0] - current[0], compare[1] - current[1]];
  return <Coord>n;
}

const applyAntinodeVector = (c: Coord, antinode: Coord) => {
  const result = [c[0] - antinode[0], c[1] - antinode[1]];
  if (result[0] < 0 || result[0] >= maxRow || result[1] < 0 || result[1] >= maxCol) {
    return null;
  }
  return <Coord>result;
}

const antinodes = grid.reduce(
  (acc, row, r) => row.reduce(
    (acc, cell, c) => {
      if (cell !== ".") {
        grid.forEach(
          (row2, r2) => row2.forEach(
            (cell2, c2) => {
              if (r === r2 && c === c2) {
                return;
              }
              if (cell2 === cell) {
                const antinodeVector = getAntinodeVector([r, c], [r2, c2]);
                const antinode = applyAntinodeVector([r, c], antinodeVector);
                if (antinode) {
                  acc.push(antinode);
                }
              }
            }
          )
        );
      }
      return acc;
    },
    acc
  ),
  <Coord[]>[]
);
const uniqueNodes = [...new Set(antinodes.map(n => n.join(",")))];
console.log(uniqueNodes.length);


// Part 2
const antinodes2 = grid.reduce(
  (acc, row, r) => row.reduce(
    (acc, cell, c) => {
      if (cell !== ".") {
        grid.forEach(
          (row2, r2) => row2.forEach(
            (cell2, c2) => {
              if (r === r2 && c === c2) {
                return;
              }
              if (cell2 === cell) {
                const antinodeVector = getAntinodeVector([r, c], [r2, c2]);
                acc.push([r, c]);
                acc.push([r2, c2]);
                let antinode = applyAntinodeVector([r, c], antinodeVector);
                while (antinode) {
                  acc.push(antinode);
                  antinode = applyAntinodeVector(antinode, antinodeVector);
                }
              }
            }
          )
        );
      }
      return acc;
    },
    acc
  ),
  <Coord[]>[]
);
const uniqueNodes2 = [...new Set(antinodes2.map(n => n.join(",")))];
console.log(uniqueNodes2.length);


