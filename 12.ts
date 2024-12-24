import { getInput, reduceSum } from "./common";

const input = await getInput(12);
const grid = input.split("\n").map((line) => line.split(""));
type Coord = [number, number];
type Regions = [string, Coord[]][];

// Part 1
const findNextPlant = (g: string[][]) => g.reduce(
  (acc, row, r) => {
    if (acc[0] !== -1) {
      return acc;
    }
    const c = row.findIndex((cell) => cell.match(/[a-z]/i));
    if (c === -1) {
      return acc;
    }
    return <Coord>[r, c];
  },
  <Coord>[-1, -1]
);

const extractRegion = (g: string[][], plant: string, coord: Coord): Coord[] => {
  const [r, c] = coord;
  if (r < 0 || r >= g.length || c < 0 || c >= g[0].length) {
    return [];
  }
  if (g[r][c] !== plant) {
    return [];
  }
  g[r][c] = ".";
  return [
    <Coord>[r, c],
    ...extractRegion(g, plant, <Coord>[r + 1, c]),
    ...extractRegion(g, plant, <Coord>[r - 1, c]),
    ...extractRegion(g, plant, <Coord>[r, c + 1]),
    ...extractRegion(g, plant, <Coord>[r, c - 1]),
  ];
}

const extractRegions = (g: string[][], regions: Regions) => {
  const [r, c] = findNextPlant(g);
  if (r === -1) {
    return regions;
  }
  const plant = g[r][c];
  regions.push([plant, extractRegion(g, plant, [r, c])]);
  return extractRegions(g, regions);
}

const getRegionPerimeter = (plant: string, region: Coord[]) =>
  region
    .map(([r, c]) => {
      const result = [
        [r + 1, c],
        [r - 1, c],
        [r, c + 1],
        [r, c - 1],
      ].filter(([r2, c2]) => grid[r2]?.[c2] !== plant);
      return result.length;
    }
    )
    .reduce(reduceSum);

const getPrice = (g: string[][]) => {
  const regions = extractRegions(g, []);
  return regions.map(([plant, region]) => region.length * getRegionPerimeter(plant, region)).reduce(reduceSum, 0);
};

console.log(getPrice(structuredClone(grid)));


// Part 2

const findGroup = (coord: Coord, groups: Coord[][]) =>
  groups.find((group) =>
    group.some(([r, c]) => r === coord[0] && c === coord[1]));

const addLinkedCoords = (coord: Coord, coords: Coord[], group: Coord[]) => {
  [
    [coord[0] + 1, coord[1]],
    [coord[0] - 1, coord[1]],
    [coord[0], coord[1] + 1],
    [coord[0], coord[1] - 1]
  ]
    .filter(([r, c]) => coords.some(([r2, c2]) => r === r2 && c === c2)) // Only coords that are in the region
    .filter(([r, c]) => !group.some(([r2, c2]) => r === r2 && c === c2)) // Only coords that are not in group
    .forEach(([r, c]) => {
      group.push([r, c]);
      addLinkedCoords([r, c], coords, group);
    });
}

const splitGroups = (coords: Coord[], i: number, groups: Coord[][]) => {
  if (i >= coords.length) {
    return groups;
  }
  const coord = coords[i];
  const groupFound = findGroup(coord, groups);
  let group = groupFound ?? [coord];
  if (!groupFound) {
    groups.push(group);
  }
  addLinkedCoords(coord, coords, group);

  return splitGroups(coords, i + 1, groups);
};

const findSides = (plant: string, region: Coord[]) => {
  const sides = region
    .map(([r, c]): [string, Coord][] =>
      [
        <[string, Coord]>["d", [r + 1, c]],
        <[string, Coord]>["u", [r - 1, c]],
        <[string, Coord]>["r", [r, c + 1]],
        <[string, Coord]>["l", [r, c - 1]],
      ]
        .filter(([_, [r2, c2]]) => grid[r2]?.[c2] !== plant)
        .map(([direction, [r2, c2]]) => {
          if (direction === "u" || direction === "d") {
            return [`${direction},${r2}`, <Coord>[r, c]];
          }
          else {
            return [`${direction},${c2}`, <Coord>[r, c]];
          }
        })
    )
    .flat()
    .reduce(
      (acc, [side, coord]) => {
        if (!acc[side]) {
          acc[side] = [];
        }
        acc[side].push(coord);
        return acc;
      },
      <Record<string, Coord[]>>{}
    );
  return Object
    .values(sides)
    .map((coords) => splitGroups(coords, 0, []))
    .flat()
    .length;

}

const getDiscountedPrice = (g: string[][]) => {
  const regions = extractRegions(g, []);
  return regions.map(([plant, region]) => {
    return region.length * findSides(plant, region);
  }).reduce(reduceSum, 0);
}

console.log(getDiscountedPrice(structuredClone(grid)));

