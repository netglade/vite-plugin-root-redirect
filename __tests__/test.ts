import {resolve} from "path";
import {execSync} from "child_process";
import fs from "fs";
import packageJson from "../package.json";

beforeEach(() => {
  const rootDir = resolve(__dirname, '..')
  process.chdir(rootDir)
  execSync('npm run build', { stdio: 'inherit' })
  execSync('npm pack', { stdio: 'inherit' })
  const packName = 'vite-plugin-root-redirect.tgz'
  if (fs.existsSync(packName)) {
    fs.unlinkSync(packName)
  }
  fs.renameSync(`netglade-vite-plugin-root-redirect-${packageJson.version}.tgz`, packName)
})

const cwdAndInstallTestProject = (name: string) => {
  const rootDir = resolve(__dirname, '..')
  const testProjectsDir = resolve(rootDir, 'test-projects')
  process.chdir(resolve(testProjectsDir, name))
  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true })
  }
  execSync('npm install', { stdio: 'inherit' })

  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\nTesting setup end.  Now running test.')
}

test("ESM Install", () => {
  cwdAndInstallTestProject('esm-install')
  execSync('npm run build', { stdio: 'inherit' })
});

test("CJS Install", () => {
  cwdAndInstallTestProject('cjs-install')
  execSync('npm run test', { stdio: 'inherit' })
});
