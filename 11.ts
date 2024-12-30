import { getInput, reduceSum } from "./common";


type NumMap = Record<number, number>;

const input = ((await getInput(11)).match(/^[\d ]+$/m)?.[0] ?? "")
  .trim()
  .split(" ")
  .map(n => parseInt(n))
  .reduce((acc, n) => ({ ...acc, [n]: (acc[n] || 0) + 1 }), <NumMap>{});

// Part 1
const applyRules = (n: number): number | [number, number] => {
  if (n === 0) {
    return 1;
  } else if (n.toString().length % 2 === 0) {
    const left = n.toString().slice(0, n.toString().length / 2);
    const right = n.toString().slice(n.toString().length / 2);
    return [parseInt(left), parseInt(right)];
  } else {
    return n * 2024;
  }
}
const blink = (input: NumMap, count: number): NumMap => {
  if (count === 0) {
    return input;
  }

  const newInput = Object.keys(input)
    .reduce(
      (acc, key) => {
        const newKey = applyRules(parseInt(key));
        // console.log(input, acc, key, newKey);
        if (Array.isArray(newKey)) {
          newKey.forEach(k => {
            acc[k] = (acc[k] || 0) + input[parseInt(key)];
          });

        } else {
          acc[newKey] = (acc[newKey] || 0) + input[parseInt(key)];
        }
        return acc;
      },
      <NumMap>{}
    );
  // console.log(newInput);
  return blink(newInput, count - 1);
};


console.log(Object.values(blink(input, 25)).reduce(reduceSum));

// Part 2
console.log(Object.values(blink(input, 75)).reduce(reduceSum));

