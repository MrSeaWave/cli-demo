/**
 * @desc 通过sea-gen 模板创建项目
 * */

const install = require("./install");

module.exports = async function() {
  const tpls = this.getInstalledGenerators(this.dir.tpl);
  if (!Object.keys(tpls).length) {
    this.console("您还没有安装任何 generator ，请执行 install 命令进行安装");
    return;
  }
  const { tpl: pkgName } = await this.inquirer.prompt({
    message: "请选择一个模板",
    type: "list",
    name: "tpl",
    choices: Object.keys(tpls),
  });
  const status = this.getInstalledStatus(pkgName, this.dir.tpl);
  if (status !== 2) {
    const { needUpdate } = await this.inquirer.prompt({
      message: `有最新的${pkgName}模板，请问是否更新`,
      type: "list",
      name: "needUpdate",
      choices: ["是", "否"],
    });
    if (needUpdate === "是") await install.call(this, pkgName);
  }

  this.yeomanEnv.register(this.resolveFrom(this.dir.tpl, pkgName), pkgName);
  this.yeomanEnv.run(pkgName, (e) => {
    // this.console(`运行结果：${e}`);
    !e && this.console(`创建项目成功🎉🎉🎉🎉🎉🎉`, "green");
  });
};
