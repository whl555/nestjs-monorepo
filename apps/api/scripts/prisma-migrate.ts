#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const moduleName = process.argv[2]; // yarn gen-module log

if (!moduleName) {
 console.error('❌ Error：请指定数据库迁移名称，例如：npx prisma migrate dev --name init');
 process.exit(1);
}


const commands = [
 `npx prisma migrate dev --name ${moduleName}`,
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
 .then(() => console.log(`✅ ${moduleName}数据库迁移成功！`))
 .catch(err => console.error(`❌ ${moduleName}数据库迁移失败：`, err));

 export {}
