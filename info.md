# CLi

## 1.创建 CLI 项目

用 `npm init` 生成项目的`package.json`文件。然后编辑该文件主要加上

```
"bin": {
     "jsm": "./bin/jsm.js"
   }
```

复制代码然后在当前目录创建你自己的脚本文件，对应上述配置为`mkdir bin && touch bin/jsm.js`
编辑创建好的文件，加上

```js
#!/usr/bin/env node
console.log("Hello CLI");
```

复制代码接下来在项目的根目录运行一下 `npm i -g`, 现在就可以在命令行使用`jsm`命令了。
注意： 一定要在开头加上`#!/usr/bin/env node`， 否则无法运行。
详解：`package.json`文件只有加上了`bin`字段，才能在控制台使用你的命令，对应的这里的命令就是 jsm，对应的执行文件为`bin/jsm.js`。 其实`"jsm"`命令就是 `"node bin/jsm.js"` 的别称，只有你用`npm i -g`全局安装后才可以用，开发的过程中直接用`node bin/jsm.js`即可。
