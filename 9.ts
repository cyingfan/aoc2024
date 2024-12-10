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
    .map((n, i) => (parseInt(n) || 0) * i)
    .reduce(reduceSum)
);


// Part 2 - WIP - Failed actual input
const findFileIdIndexes = (fs: string[], fileId: string) => [fs.lastIndexOf(fileId), fs.indexOf(fileId)];
const findFirstFittingEmpyBlockIndex = (fs: string[], length: number, start = 0) => {
  if (start >= fs.length) {
    return -1;
  }
  const slice = fs.slice(start);
  const findBlockLength = (index: number, count: number) => {
    if (slice[index] !== ".") {
      return count - 1;
    };
    return findBlockLength(index + 1, count + 1);
  }
  const index = slice.indexOf(".");
  if (index === -1) {
    return -1;
  }
  const blockLength = findBlockLength(index, 1);
  if (blockLength >= length) {
    return index + start;
  }
  return findFirstFittingEmpyBlockIndex(fs, length, start + index + length);
};

const defrag = (fs: string[], fileId: string) => {
  if (parseInt(fileId) <= 0) {
    return fs;
  }
  const [lastFileIdIndex, firstFileIdIndex] = findFileIdIndexes(fs, fileId);
  const fileBlockLength = lastFileIdIndex - firstFileIdIndex + 1;
  const firstFittingEmpyBlockIndex = findFirstFittingEmpyBlockIndex(fs, fileBlockLength);

  if (firstFittingEmpyBlockIndex !== -1 && firstFittingEmpyBlockIndex < firstFileIdIndex) {
    console.log(fileId, fileBlockLength, firstFittingEmpyBlockIndex);
    fs.splice(firstFittingEmpyBlockIndex, fileBlockLength, ...Array(fileBlockLength).fill(fileId));
    fs.splice(firstFileIdIndex, fileBlockLength, ...Array(fileBlockLength).fill("."));
  }
  return defrag(fs, (parseInt(fileId) - 1).toString());
};

const lastFileIdLastIndex = filesystem.findLastIndex(f => f.match(/\d/));
const lastFileId = filesystem[lastFileIdLastIndex];
const result2 = defrag([...filesystem], lastFileId);
console.log(
  result2
    .map((n, i) => (parseInt(n) || 0) * i)
    .reduce(reduceSum)
);


