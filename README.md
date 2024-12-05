# Advent of Code 2024
In [bun](https://bun.sh/).

## Preparation
Grab the session value from cookie after logged into adventofcode.com. Put the value (without `session=`) into .env (see [sample .env file](https://github.com/TheR1D/shell_gpt/blob/main/sample.env)).

To run

```bash
bun run <day>.ts
```

To run using example input
```
bun run <day>.ts --test [--match <match-number>]
```
- Highly experimental, may break in some days.
- If `--match <match-number>` is not provided, the first match is used.
- `<match-number>` is a zero-based index. So first match is 0.

This project was created using `bun init` in bun v1.1.38. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
