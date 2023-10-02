import chalk from 'chalk';

export const log = (...msg: string[]) => {
  const timestamp = new Date()
  // hh:mm:ss
  const time = timestamp.toTimeString().slice(0, 8)
  console.log(chalk.gray(time), chalk.blueBright('[vite-shadow-dom]'), ...msg)
}
