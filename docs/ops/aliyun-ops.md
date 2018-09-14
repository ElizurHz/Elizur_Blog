# 个人网站在阿里云的简单部署

## 购买主机

我购买了两台主机，都是的是1核 + 1GHz + 1Mbps 的配置，系统一台是为 Ubuntu 14.04，另一台是 CentOS 7.4。直连实测 700 多 KB 的 Webpack 生产打包后的 React 的 js 文件需要十多秒才能加载，速度大约 60KB/s。

## 启动实例

购买后实例是自动启动的，但是需要进行一些初始化的设置。

进入 ECS 的实例页面，首先如果需要从控制台远程连接，阿里云会提供一个远程连接密码，这个密码需要记住，每次从控制台远程连接时会需要。

我们正常的开发一般是从 Terminal 或者 FileZilla 等 SFTP 客户端去连接服务器，为了进行此操作，我们需要设置初始密码。控制台的实例页面点击 “更多” => “密码/密钥” => “重置密码” 即可重置 Linux 登录密码，也是 ssh 的密码。重置后我们就可以使用刚刚输入的密码，通过 `ssh root@${yourServerIp}` 登陆。

而 FileZilla 也是一样，建立一个 SFTP 连接，使用用户 root 和更改好的密码即可。

## 系统配置

首先第一步，把 Ubuntu 的 apt-get 的源换成清华的镜像。

其次，安装必要的环境，包括 Node.js, MongoDB 等。

安装 pm2。

### 安装 nginx

依赖：
gcc gcc-c++
pcre
openssl
zlib
zlib-devel

### 配置 Nginx

site-enable

### 部署服务端

我的项目服务端用的是 Koa2，托管在 bitbucket 上。

1. 从 bitbucket 上将项目拉取下来。
2. `npm install` 安装需要的 npm packages。
3. 通过 pm2 启动服务，我的项目用的是 Koa2 的脚手架，使用命令 `pm2 start ./bin/www --watch` 即可。
4. 可以通过 `pm2 list` 查看正在运行的服务，例如我有部署多个后端服务；通过 `pm2 describe ${id}` 和 `pm2 show ${id}` 可以查看某个服务的详情。

### MongoDB

如果需要在本机（非服务器所在内网）测试访问 MongoDB，则需要修改 MonogoDB 配置。

## 关于备案
