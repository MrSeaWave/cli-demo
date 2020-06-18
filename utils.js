const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;

class Utils {
  /**
   * @desc 获取某个包的安装情况
   * @return {number} 0: 表示未安装，1：表示安装但并非最新，2：表示安装最新
   * */
  getInstalledStatus(pkgName, targetDir) {
    const dependencies = this.getInstalledPkgs(targetDir);
    if (!dependencies[pkgName]) return 0;
    const latestVersion = String(
      execSync(`npm view ${pkgName} version --json --registry=https://registry.npm.taobao.org`)
    )
      .trim()
      .replace(/"/g, "");

    // 类似 require，但支持指定目录，让你可以跨工程目录进行 require，比如全局包想引用工程路径下的内容
    const current = this.requireFrom(targetDir, path.join(pkgName, "package.json")).version;
    if (latestVersion === current) return 2;
    return 1;
  }

  /**
   * @desc 获取路径下已经安装的模板包 generator
   * */
  getInstalledGenerators(targetDir) {
    const dependencies = this.getInstalledPkgs(targetDir);
    Object.keys(dependencies).forEach(key => {
      if (!/^sea-gen-/.test(key)) delete dependencies[key];
    });
    return dependencies;
  }
  /**
   *@desc 获取路径下已经安装的包
   */
  getInstalledPkgs(targetDir) {
    const pkgJsonFile = path.resolve(targetDir, "package.json");
    if (!fs.existsSync(pkgJsonFile)) return {};
    const pkgJson = require(pkgJsonFile);
    return pkgJson.dependencies || {};
  }
}

module.exports = Utils;
