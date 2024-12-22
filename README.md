# 配置环境
1. `node >= 16`
2. `npm >= 8.1.0`

# 安装依赖
## 安装 yarn
`npm install -g yarn`
## 安装依赖
`yarn install`

# 开发
1. 确认后端 server 服务启动
2. `yarn start`

# todo
1. - [ ] 语音转写目前使用的方案是使用chrome内置的mediaDevices，识别后会将语音[一个包含wav文件的Blob二进制对象]发送到后端。
2. - [ ] 目前实现的是单轮对话，需要支持多轮对话
3. - [ ] 实现replay效果