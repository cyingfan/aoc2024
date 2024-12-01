export const getInput = async (day: number) => {
  const url = `https://adventofcode.com/2024/day/${day}/input`;
  const response = await fetch(url, {
    headers: {
      cookie: `session=${process.env.COOKIE}`
    }
  });
  return await response.text();
};

export const reduceSum = (a: number, b: number) => a + b;
