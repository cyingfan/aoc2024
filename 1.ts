import { getInput, reduceSum } from "./common";

const day = 1;
const input = await getInput(day);

/**
 * Part 1
 */
const lines = input
  .split("\n").filter(x => !!x)
  .map(x => x.split("   "));
const leftList = lines.map(line => parseInt(line[0]));
const rightList = lines.map(line => parseInt(line[1]));
const sorter = (a: number, b: number) => a - b;
leftList.sort(sorter);
rightList.sort(sorter);
const sum =
  leftList
    .map((left, index) => Math.abs(left - rightList[index]))
    .reduce(reduceSum);

console.log(sum);


/**
 * Part 2
 */
const rightIndex = rightList.reduce(
  (acc, x) => ({ ...acc, [x]: (acc[x] ?? 0) + 1 }),
  {} as Record<number, number>
);
const sum2 =
  leftList
    .map(left => left * (rightIndex[left] ?? 0))
    .reduce(reduceSum);
console.log(sum2);
