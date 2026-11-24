// The One-Line AI Excuse for Breaking Production.
// Bounty: u-hamsyh-the-one-line-ai-excuse-for-breaking-e53dac66
//
// What this program does, in one sentence: it takes the excuse below,
// which is baked into this file as a plain string, and writes it out
// as entry.txt in the output directory the grader provides.
//
// Why the text lives here instead of in a sidecar file: the grader
// copies only this entrypoint into its sandbox and runs it from an
// arbitrary working directory, so anything this program tried to read
// from disk at runtime would simply not be there. Keeping the line
// inline makes the run hermetic — same bytes in, same bytes out,
// wherever it is launched from. No network, no subprocesses, no
// browser, just the Node standard library.

import * as fs from "node:fs";
import * as path from "node:path";

const MAX_CHARS = 180;
const OUT_NAME = "entry.txt";

const EXCUSE =
  "I made checkout 40% faster by deleting its slowest step — the one where customers actually pay.";

// Every rule the gate enforces, checked up front so a bad line fails
// loudly here instead of silently scoring zero on the grader.
function problemsFor(line: string): string[] {
  const problems: string[] = [];
  if (line.length < 1) problems.push("entry is empty");
  if (line.length > MAX_CHARS) {
    problems.push(`entry is ${line.length} characters, over the ${MAX_CHARS} limit`);
  }
  if (line.trim().length === 0) problems.push("entry is only whitespace");
  if (line.includes("\n") || line.includes("\r")) {
    problems.push("entry must be a single line");
  }
  return problems;
}

function emit(line: string): string {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const target = path.join(outDir, OUT_NAME);
  fs.writeFileSync(target, line, "utf8");
  return target;
}

function main(): void {
  const problems = problemsFor(EXCUSE);
  if (problems.length > 0) {
    for (const problem of problems) console.error(`gate: ${problem}`);
    process.exitCode = 1;
    return;
  }
  const target = emit(EXCUSE);
  console.log(`wrote ${EXCUSE.length} characters to ${target}`);
}

main();
