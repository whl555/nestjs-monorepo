#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const moduleName = process.argv[2]; // yarn gen-module log

if (!moduleName) {
 console.error('❌ Error：请指定模块名称，例如：npm run generate-module -- auth');
 process.exit(1);
}


const commands = [
 `nest g module ${moduleName}`,
 `nest g service ${moduleName} --no-spec`,
 `nest g controller ${moduleName} --no-spec`,
];


commands.reduce((promise, cmd) => (
 promise.then(() => (
   new Promise((resolve, reject) => (
     childProcess.exec(cmd, (error, stdout) => (
       error ? reject(error) : resolve(stdout)
     ))
   ))
 ))
), Promise.resolve())
 .then(() => console.log(`✅ ${moduleName}模块生成成功！`))
 .catch(err => console.error(`❌ ${moduleName}模块生成失败：`, err));

 export {}
