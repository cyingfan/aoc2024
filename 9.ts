import { getInput, reduceSum } from "./common";

const input = await getInput(9);

// Part 1
const expandFs = (input: string) => input
  .split("")
  .map(n => parseInt(n))
  .map((n, i) => Array(n).fill(i % 2 ? "." : (i / 2).toString()))
  .flat();

const move = (fs: string[]) => {
  const lastFileIdIndex = fs.findLastIndex(f => f.match(/\d/));
  const firstEmptySpaceIndex = fs.indexOf(".");
  if (firstEmptySpaceIndex > lastFileIdIndex) {
    return false;
  }
  [fs[lastFileIdIndex], fs[firstEmptySpaceIndex]] = [fs[firstEmptySpaceIndex], fs[lastFileIdIndex]];
  return fs;
}

const compact = (fs: string[]) => {
  const result = move(fs);
  if (!result) {
    return fs;
  }
  return compact(result);
}

const filesystem = expandFs(input);

const result = compact([...filesystem]);
console.log(
  result
    .map((n, i) => (parseInt(n, 10) || 0) * i)
    .reduce(reduceSum)
);


// Part 2

// fileId => [length, index]
type FileMap = Record<number, [number, number]>;

const expandFs2 = (input: string) => input
  .split("")
  .map(n => parseInt(n))
  .reduce(
    (acc, n, i) => {
      if ((i % 2) === 0) {
        acc[1][i / 2] = [n, acc[0]];
      }
      acc[0] += n;
      return acc;
    },
    <[number, FileMap]>[0, {}]);

const [, filesystem2] = expandFs2(input);

const fileIds = Object.keys(filesystem2).map(k => parseInt(k, 10));
const lastId = Math.max(...fileIds);

const findFirstFittingBlock = (fs: FileMap, fIds: number[], length: number) => {
  if (fIds.length <= 1) {
    return -1;
  }
  const freeBlockLength = fs[fIds[1]][1] - fs[fIds[0]][1] - fs[fIds[0]][0];
  if (freeBlockLength >= length) {
    return fs[fIds[0]][1] + fs[fIds[0]][0];
  }
  return findFirstFittingBlock(fs, fIds.slice(1), length);
};

const defrag = (fs: FileMap, fIds: number[], lastId: number) => {
  if (lastId <= 1) {
    return fIds;
  }
  const firstFittingBlockIndex = findFirstFittingBlock(fs, fIds, fs[lastId][0]);
  if (firstFittingBlockIndex !== -1 && firstFittingBlockIndex < fs[lastId][1]) {
    fs[lastId][1] = firstFittingBlockIndex;
  }
  fIds.sort((a, b) => fs[a][1] - fs[b][1]);
  return defrag(fs, fIds, lastId - 1);
};

const fIds = defrag(filesystem2, fileIds, lastId);
console.log(
  fIds
    .map(n =>
      Array(filesystem2[n][0])
        .fill(n)
        .map((n, i) => n * (i + filesystem2[n][1]))
        .reduce(reduceSum)
    )
    .reduce(reduceSum)
)
