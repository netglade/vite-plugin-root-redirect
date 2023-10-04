import {execSync} from "child_process";
import fs from "fs";

{
    fs.rmSync("dist", {recursive: true, force: true})
}

// NOTE: Build ESM
{
    execSync("cross-env MODULE=esm vite build", {stdio: "inherit"})
    fs.mkdirSync('dist/esm', {recursive: true})
    for (const fileName of fs.readdirSync("dist")) {
        const filePath = `dist/${fileName}`
        if (fs.lstatSync(filePath).isFile()) {
            fs.renameSync(filePath, `dist/esm/${fileName}`)
        }
    }
    fs.writeFileSync("dist/esm/package.json", JSON.stringify({
        type: "module",
    }, null, 2))
}

// NOTE: Build CJS
{
    execSync("cross-env MODULE=cjs vite build", {stdio: "inherit"})
    fs.mkdirSync('dist/cjs', {recursive: true})
    for (const fileName of fs.readdirSync("dist")) {
        const filePath = `dist/${fileName}`
        if (fs.lstatSync(filePath).isFile()) {
            fs.renameSync(filePath, `dist/cjs/${fileName}`)
        }
    }
    fs.writeFileSync("dist/cjs/package.json", JSON.stringify({
        type: "commonjs",
    }, null, 2))
}
