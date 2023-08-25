1. 在小程序目录下新建 windi.wxss 空文件

2. 在 app.wxss 引入 windi.wxss
// app.wxss
@import 'windi.wxss'

3. 全局安装windicss依赖(安装过后，后续无需再次安装)
npm i -g windicss

4. 在小程序目录下执行生成windi内容
<!-- npx windicss './pages/**/**.wxml' -o windi.wxss -d -->
npx windicss --config windi.config.js -o windi.wxss -d
执行此命令后，会监听文件变化重新生成windi.wxss
可以指定目录，也可以 windi.config.js 配置文件中指定多个目录，如果不指定的话，
会监听 miniprogram_npm 的文件，导致生成的文件不兼容报错

5. 样式名称和 Tailwind CSS 一样

6. 每次都要先运行第 4 条的命令

7. 组件类使用全局样式
options: {
  styleIsolation: 'apply-shared'
},