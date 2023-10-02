import { program } from 'commander'
// import {Func} from "./func.ts";

export function cliMain() {
  program
    .option('-i, --input <path>', 'input file')
    .option('-o, --output <path>', 'output file')

  program.parse();

  const options = program.opts();
  const input = options.input;
  const output = options.output;
  console.log({ input, output })
}
