/**
 * @desc 安装模板仓库，模板前缀 sea-gen-
 * */

const execSync = require("child_process").execSync;

module.exports = async function(pkgName) {
  let name = pkgName || process.argv[3];
  name = /^sea-gen-/.test(name) ? name : `sea-gen-${name}`;
  const status = this.getInstalledPkgs(name, this.dir.tpl);
  if (status === 2) {
    this.console("你已安装最新版，无需再次安装");
    return;
  }
  this.console(`正在安装最新版的 ${name} ...`);
  try {
    execSync(`npm i ${name}@latest -S --registry=https://registry.npm.taobao.org`, {
      cwd: this.dir.tpl,
    });
    this.console("升级完成", "green");
  } catch (e) {
    this.console(`安装失败，请检查包名称是否正确 ${pkgName}`, 'red')
  }
};
