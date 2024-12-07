import { getInput, reduceSum } from './common';

const day = 7;
const input = await getInput(day);

// Part 1
const operators = ["+", "*"];
const expressions = <[number, number[]][]>input
  .split("\n")
  .map(l => l.split(": "))
  .map(
    p => [
      parseInt(p[0]),
      p[1].split(" ").map(n => parseInt(n))
    ]
  );
const getOperatorPermutations = (n: number, operators: string[]) => {
  const result = <string[][]>[];
  const recurse = (acc: string[], depth: number) => {
    if (depth === n) {
      result.push(acc);
      return;
    }
    operators.forEach(o => {
      recurse(acc.concat([o]), depth + 1);
    });
  };
  recurse([], 0);
  return result;
};

const results = expressions.filter(([expected, numbers]: [number, number[]]) => {
  const operatorPermutations = getOperatorPermutations(numbers.length - 1, operators);
  return operatorPermutations.some((ops: string[]) => {
    const calculated = numbers.reduce((acc, n, i) => eval(`${acc}${ops[i - 1] || ""}${n}`));
    return calculated === expected;
  });
});
console.log(results.map(r => r[0]).reduce(reduceSum, 0));


// Part 2
const newOperators = ["+", "*", ""];
const results2 = expressions.filter(([expected, numbers]: [number, number[]]) => {
  const operatorPermutations = getOperatorPermutations(numbers.length - 1, newOperators);
  return operatorPermutations.some((ops: string[]) => {
    const calculated = numbers.reduce((acc, n, i) => eval(`${acc}${ops[i - 1] || ""}${n}`));
    return calculated === expected;
  });
});
console.log(results2.map(r => r[0]).reduce(reduceSum, 0));

