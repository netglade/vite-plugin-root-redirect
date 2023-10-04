import {execSync} from "child_process";
import fs from "fs";

// NOTE: Build ESM
{
    if (fs.existsSync("tsconfig.json")) {
        fs.unlinkSync("tsconfig.json")
    }
    fs.copyFileSync("tsconfig.esm.json", "tsconfig.json")
    fs.mkdirSync('dist/esm', {recursive: true})
    execSync("vite build", {stdio: "inherit"})
}

// NOTE: Build CJS
{
    if (fs.existsSync("tsconfig.json")) {
        fs.unlinkSync("tsconfig.json")
    }
    fs.copyFileSync("tsconfig.cjs.json", "tsconfig.json")
    fs.mkdirSync('dist/cjs', {recursive: true})
    execSync("vite build", {stdio: "inherit"})
}
