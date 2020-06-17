# sea-cli-demo

简易版脚手架 demo，用最精简的代码，实现了最核心的功能

一个 cli 的核心功能包括

- cli 本身提供全局命令，起到安装、调用、调度的总控作用
- 模板仓库，快速初始化一个工程，类似 `vue-cli` `create-react-app` 提供的模板功能
- 构建插件，把 `webpack` 的功能单独拎出来并封装，工程中无需再关心 `webpack`。当然，如果有特殊的 `webpack` 需求，也支持个性化的配置

## 参考

- [cli-tpl](https://github.com/imaoda/cli-tpl)
