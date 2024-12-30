import { getInput, reduceSum } from "./common";

const input = await getInput(13);

type Coord = { x: number; y: number };
type Machine = { a: Coord, b: Coord, prize: Coord };
type Pushes = { a: number, b: number };

const machines = input
  .split("\n\n")
  .map(machine => {
    const [a, b, prize] = machine.split("\n");
    const regex = /X(?:\+|=)(\d+), Y(?:\+|=)(\d+)/;
    const aMatch = a.match(regex);
    const bMatch = b.match(regex);
    const prizeMatch = prize.match(regex);
    if (!aMatch || !bMatch || !prizeMatch) {
      throw new Error("Invalid machine");
    }
    return <Machine>{
      a: { x: parseInt(aMatch[1]), y: parseInt(aMatch[2]) },
      b: { x: parseInt(bMatch[1]), y: parseInt(bMatch[2]) },
      prize: { x: parseInt(prizeMatch[1]), y: parseInt(prizeMatch[2]) }
    };
  });

const getAPushes = (machine: Machine) =>
  (machine.prize.y * machine.b.x - machine.b.y * machine.prize.x) /
  (machine.b.x * machine.a.y - machine.b.y * machine.a.x);

const getSolution = (machine: Machine): Pushes | false => {
  const aPushes = getAPushes(machine);
  if (Math.round(aPushes) !== aPushes) {
    return false;
  }
  const bPushes = (machine.prize.x - aPushes * machine.a.x) / machine.b.x;
  if (Math.round(bPushes) !== bPushes) {
    return false;
  }
  return { a: aPushes, b: bPushes };
}

// Part 1
console.log(
  machines
    .map(getSolution)
    .filter(solution => !!solution)
    .map(solution => solution.a * 3 + solution.b)
    .reduce(reduceSum)
);

// Part 2
const tuneMachine = (machine: Machine) => {
  machine.prize.x += 10000000000000;
  machine.prize.y += 10000000000000;
  return machine;
}

console.log(
  machines
    .map(tuneMachine)
    .map(getSolution)
    .filter(solution => !!solution)
    .map(solution => solution.a * 3 + solution.b)
    .reduce(reduceSum)
);


