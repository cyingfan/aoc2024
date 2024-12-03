import { getInput } from "./common"

const day = 3;
const input = await getInput(day);

const sumMultiplication = (acc: number, match: RegExpExecArray) => parseInt(match[1]) * parseInt(match[2]) + acc;

/**
 * Part 1
 */
const regex = /mul\((\d+),(\d+)\)/g;
const matches = input.matchAll(regex);
const sum = matches.reduce(sumMultiplication, 0);
console.log(sum);

/**
 * Part 2
 */
const regex2 = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g
const matches2 = input.matchAll(regex2);
const [, runnableInstructions] = matches2.reduce((acc, match) => {
  if (match[0] === "do()") {
    acc[0] = true;
  } else if (match[0] === "don't()") {
    acc[0] = false;
  } else if (acc[0]) {
    acc[1].push(match);
  }
  return acc;
}, [true, []] as [boolean, RegExpExecArray[]]);
const sum2 = runnableInstructions.reduce(sumMultiplication, 0);
console.log(sum2);

