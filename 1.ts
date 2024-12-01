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

leftList.sort((a, b) => a - b);
rightList.sort((a, b) => a - b);
const sum = leftList
  .map((left, index) => Math.abs(left - rightList[index]))
  .reduce(reduceSum, 0);

console.log(sum);


/**
 * Part 2
 */
const rightIndex = rightList.reduce((acc, x) => {
  acc[x] = (acc[x] ?? 0) + 1;
  return acc;
}, {} as Record<number, number>);
const sum2 = leftList
  .map((left, index) => left * (rightIndex[left] ?? 0))
  .reduce(reduceSum, 0);
console.log(sum2);
