import { getInput, reduceSum } from "./common";

const day = 5;
const input = await getInput(day);

const [_rules, _updates] = input.split("\n\n");

type Rule = [number, number];
const rules = _rules.split("\n")
  .filter(x => !!x)
  .map(r => r.split("|").map(n => parseInt(n)) as Rule);

const updates = _updates.split("\n")
  .filter(x => !!x)
  .map(u => u.split(",").map(n => parseInt(n)));

// Part 1
const findRules = (p: number, u: number[]) => rules.filter(r =>
  (p === r[0] && u.indexOf(r[1]) !== -1) ||
  (p === r[1] && u.indexOf(r[0]) !== -1));
const validateRule = (p: number, index: number, r: Rule, update: number[]) =>
  (p === r[0] && index < update.indexOf(r[1])) ||
  (p === r[1] && index > update.indexOf(r[0]));

const validUpdates = updates.filter(u => u.every((p, i) => findRules(p, u).every(r => validateRule(p, i, r, u))));
console.log(validUpdates.map(u => u[Math.floor(u.length / 2)]).reduce(reduceSum));

// Part 2
const getUpdateRules = (u: number[]) => u.map(p => findRules(p, u)).flat();
const fixUpdates = (rules: Rule[], update: number[]) => {
  const failedRules = rules.filter(r => update.some((p, i) => !validateRule(p, i, r, update)));
  for (let x = 0; x < failedRules.length; x++) {
    const rule = failedRules[x];
    const leftIndex = update.indexOf(rule[0]);
    const rightIndex = update.indexOf(rule[1]);
    if ((leftIndex - rightIndex) === 1) {
      // Safe to swap
      [update[leftIndex], update[rightIndex]] = [update[rightIndex], update[leftIndex]];
      return fixUpdates(rules, update);
    }
  }
  return update;
};

const invalidUpdates = updates
  .filter(u => u.some((p, i) => findRules(p, u).some(r => !validateRule(p, i, r, u))))
  .map(u => getUpdateRules(u))
  .map(r => [r, [...new Set(r.flat(2))]] as [Rule[], number[]])
  .map(([rules, update]) => fixUpdates(rules, update));
console.log(invalidUpdates.map(u => u[Math.floor(u.length / 2)]).reduce(reduceSum));

// Part 2 insert-sort
type Node = {
  value: number;
  left: Node[];
  right: Node[];
};
const findNode = (value: number, nodes: Node[]) => nodes.find(n => n.value === value);
const rulesToNodes = (rules: Rule[]) => rules.reduce((nodes, [a, b]) => {
  const nodeA = findNode(a, nodes) || { value: a, left: [], right: [] };
  const nodeB = findNode(b, nodes) || { value: b, left: [], right: [] };
  nodeA.right.push(nodeB);
  nodeB.left.push(nodeA);
  return [...nodes.filter(n => n.value !== a && n.value !== b), nodeA, nodeB];
}, [] as Node[]);

const nodesToUpdate = (nodes: Node[], update: number[]) => {
  if (nodes.length === 0) {
    return update;
  }
  const leftNodeIndex = nodes.findIndex(n => n.left.length === 0);
  const leftNode = nodes[leftNodeIndex];
  update.push(leftNode.value);
  leftNode.right.forEach(n => {
    n.left.splice(n.left.findIndex(l => l.value === leftNode.value), 1);
  });
  nodes.splice(leftNodeIndex, 1);
  return nodesToUpdate(nodes, update);
};

const invalidUpdates2 = updates
  .filter(u => u.some((p, i) => findRules(p, u).some(r => !validateRule(p, i, r, u))))
  .map(getUpdateRules)
  .map(rulesToNodes)
  .map(nodes => nodesToUpdate(nodes, []));
console.log(invalidUpdates2.map(u => u[Math.floor(u.length / 2)]).reduce(reduceSum));

