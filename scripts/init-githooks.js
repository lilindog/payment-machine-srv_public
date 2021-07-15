"use strict";

/**
 * 初始化githook 
 */

const { writeFileSync, existsSync, readdirSync } =require("fs");
const { resolve, join } = require("path");
const { execSync } = require("child_process");
const platform = require("os").platform();

const 
    targetDir = resolve(__dirname, "../.git/hooks"),
    scriptDir = resolve(__dirname);

main();

function main () {
    const 
        hooks = readdirSync(targetDir).map(name => {
            name = name.split(".")[0];
            if (existsSync(join(scriptDir, name + ".js"))) {
                return name;
            }
        })
        .reduce((t, c) => {
            if (c !== undefined && !t.includes(c)) {
                t.push(c);
            }
            return t;
        }, []);
    console.log("正在部署githook...");
    hooks.forEach((name, index) => {
        console.log(`[${index}] ${name}`);
        writeHookFile(name);
    });
    console.log("githook部署完成！\n");
    execSync("chmod -R 777 " + resolve(__dirname, "../.git"));

}

function writeHookFile (name) {
    const scriptPath = platform === "win32" ? join(scriptDir, name + ".js").replace(/\\/g, "\\\\") : join(scriptDir, name + ".js");
    writeFileSync(
        join(targetDir, name), 
        `#!/usr/bin/env node
        const { spawn } = require("child_process");
        const cp = spawn("node", ["${scriptPath}"], { stdio: "inherit" });
        cp.on("exit", code => {
            process.exit(code);
        });
        `
        .replace(/\s/, "<sign1>")
        .replace(/\n/, "<sign2>")
        .replace(/\s+/g, " ")
        .replace(/\n/g, "")
        .replace("<sign1>", " ")
        .replace("<sign2>", "\n")
    );
}