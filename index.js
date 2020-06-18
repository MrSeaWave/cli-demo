const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const resolveFrom = require("resolve-from").silent; // 类似 require，但支持指定目录，让你可以跨工程目录进行 require，比如全局包想引用工程路径下的内容
const requireFrom = require("import-from").silent; // require.resolve
const yeomanEnv = require("yeoman-environment").createEnv(); // 【核心】用于执行一个「模板插件包」
const inquirer = require("inquirer"); // 询问用户并记录反馈结果，界面互动的神器
const mkdirp = require("mkdirp"); // 跨平台创建包
const execSync = require("child_process").execSync;
const minimist = require("minimist"); // 解析用户命令，将 process.argv 解析成对象

const homeDir = require("osenv").home(); // 跨平台的系统信息
const tplDir = path.resolve(homeDir, ".demo-tpl-cache");
const cmdDirName = "scripts";

const Utils = require("./utils");
const pkg = require("./package.json");

const args = minimist(process.argv);

class Main extends Utils {
  constructor(args) {
    super();
    this.args = args;
    this.bindTools();
    this.checkTplDir();
    this.runCmd();
  }

  bindTools() {
    this.chalk = chalk;
    // 类似于require.resolve
    this.resolveFrom = resolveFrom;
    this.requireFrom = requireFrom;
    this.dir = {
      cwd: process.cwd(),
      home: homeDir,
      tpl: tplDir,
    };
    this.yeomanEnv = yeomanEnv;
    this.inquirer = inquirer;
  }

  checkTplDir() {
    mkdirp(this.dir.tpl);
    const pkgFile = path.resolve(this.dir.tpl, "package.json");
    if (!fs.existsSync(pkgFile)) {
      const info = { name: "tpl", description: "-", repository: "-", license: "MIT" };
      fs.writeFileSync(pkgFile, JSON.stringify(info));
    }
  }

  checkCliUpdate() {
    const { name, version } = pkg;
    const latestVersion = String(
      execSync(`npm view ${name} version --json --registry=https://registry.npm.taobao.org`)
    );
    if (latestVersion !== version) {
      this.console(
        `cli 版本过旧，建议执行 npm i -g ${name}@latest 升级 cli: ${version}--->${latestVersion}`
      );
    }
  }
  // 检测cmd
  checkCmd() {
    // 可以使用的命令
    const cmdArr = fs
      .readdirSync(path.resolve(__dirname, cmdDirName))
      .map(item => item.split(".")[0]);
    const current = process.argv[2];
    // 检测命令
    if (!cmdArr.includes(current)) {
      this.console(`没有该命令 ${current},请使用以下命令 ${JSON.stringify(cmdArr)}`, "red");
      return false;
    }
    return true;
  }

  runCmd() {
    if (!this.checkCmd()) return;
    this.checkCliUpdate();
    const cmd = require(path.resolve(__dirname, cmdDirName, process.argv[2]));
    // 运行执行文件，scripts 里的命令函数可读取 this 实例
    cmd.call(this);
  }

  console(data, color = "yellow") {
    const fn = chalk[color] || chalk.yellow;
    console.log(fn(data));
  }
}

module.exports = new Main(args);
