import { getInput, reduceSum } from './common';

const day = 7;
const input = await getInput(day);

// Part 1
type Operators = Record<string, (a: number, b: number) => number>;
const operators: Operators = {
  "+": (a, b) => a + b,
  "*": (a, b) => a * b
};
type Expressions = [number, number[]][];
const expressions = <Expressions>input
  .split("\n")
  .map(l => l.split(": "))
  .map(
    p => [
      parseInt(p[0]),
      p[1].split(" ").map(n => parseInt(n))
    ]
  );

const permutations: Record<string, string[][]> = {};
const getOperatorPermutations = (n: number, operators: string[]) => {
  const key = `${n}-${operators.join("")}`;
  if (permutations[key]) {
    return permutations[key];
  }
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
  permutations[key] = result;
  return result;
};
const getResults = (expressions: Expressions, operators: Operators) =>
  expressions.filter(([expected, numbers]: [number, number[]]) =>
    getOperatorPermutations(numbers.length - 1, Object.keys(operators))
      .some((ops: string[]) =>
        expected === numbers.slice(1).reduce((acc, n, i) => operators[ops[i]](acc, n), numbers[0])
      )
  );


const results = getResults(expressions, operators);
console.log(results.map(r => r[0]).reduce(reduceSum, 0));


// Part 2
operators["}|"] = (a: number, b: number) => parseInt(a.toString() + b.toString());
const results2 = getResults(expressions, operators);
console.log(results2.map(r => r[0]).reduce(reduceSum, 0));


