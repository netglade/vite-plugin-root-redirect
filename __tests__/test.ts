import {resolve} from "path";
import {execSync} from "child_process";
import fs from "fs";
import packageJson from "../package.json";

const cwdAndInstallTestProject = (name: string) => {
  const rootDir = resolve(__dirname, '..')
  const testProjectsDir = resolve(rootDir, 'test-projects')
  process.chdir(resolve(testProjectsDir, name))
  execSync('npm install', { stdio: 'inherit' })

  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\nTesting setup end.  Now running test.')
}

beforeEach(() => {
  const rootDir = resolve(__dirname, '..')
  process.chdir(rootDir)
  execSync('npm run build', { stdio: 'inherit' })
  execSync('npm pack', { stdio: 'inherit' })
  fs.renameSync(`netglade-vite-plugin-root-redirect-${packageJson.version}.tgz`, 'vite-plugin-root-redirect.tgz')
})

test("ES Install", () => {
  cwdAndInstallTestProject('es-install')
});
