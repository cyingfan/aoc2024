import { parseArgs } from "util";

export const getInput = async (day: number) => {
  const args = getArgs();
  if (args.test) {
    const text = await fetchAoc(`https://adventofcode.com/2024/day/${day}`);
    const regex = /<pre><code>(.*?)<\/code><\/pre>/sg;
    const match = [...text.matchAll(regex)][parseInt(args.match ?? "0")];
    return match ? match[1].trim() : "";

  } else {
    return await fetchAoc(`https://adventofcode.com/2024/day/${day}/input`);
  }
};

const fetchAoc = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      cookie: `session=${process.env.COOKIE}`
    }
  });
  return await response.text();
}

const getArgs = () => {
  const { values } = parseArgs({
    args: Bun.argv,
    options: {
      test: { type: "boolean" },
      match: { type: "string", default: "0" }
    },
    allowPositionals: true
  });
  return values;
};

export const reduceSum = (a: number, b: number) => a + b;
