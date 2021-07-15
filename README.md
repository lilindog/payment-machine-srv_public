# 硬件收银机api服务
使用koa、mysql，没啥好讲的。   
要先申请支付宝支付api，配置好公私钥；该项目需要其私钥。   

## 目录结构
```
payment-machine-srv_public
├── .eslintignore
├── .eslintrc.json
├── .gitignore
├── .npmrc
├── apidoc.json // 文档生成配置
├── doc // 文档生成目录， 不用直接干预这里边的文件
│   ├── vendor
│   ├── utils
│   ├── main.js
│   ├── locales
│   ├── index.html
│   ├── img
│   ├── fonts
│   ├── css
│   ├── api_project.json
│   ├── api_project.js
│   ├── api_data.json
│   └── api_data.js
├── env // 配置文件目录
│   ├── run.env
│   └── comm.env
├── init.sql // 表结构初始化sql
├── log // 日志目录
│   ├── log.log.2021-07-10
│   ├── log.log.2021-07-08
│   └── log.log
├── package-lock.json
├── package.json
├── README.md
├── scripts // 开发辅助脚本
│   ├── pre-push.js
│   ├── pre-commit.js
│   ├── init-githooks.js
│   └── comm.js
├── src
│   ├── utils
│   ├── services
│   ├── routers
│   ├── models
│   ├── middleware
│   └── app.mjs
└── upload // 上传文件存放目录
    └── -aAbyhbgUGYAf2Dnaym_htjy.png
```

## 开发
!!!需要先将配置好的支付宝api公私钥对的私钥放在该项目的根目录。  
老规矩，先`npm install `安装依赖.   
* 开发运行 `npm run dev`
* 生成文档 `npm run doc`
* 检查代码 `npm run lint`, 在commit代码的时候也会触发githook执行检查，不过不给提交。   

## 配置
配置都在env目录里。  
