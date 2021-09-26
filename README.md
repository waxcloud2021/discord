## POAP-bot获取code 自动化脚本

1. 安装node和git，要求nodejs版本不低于12.16.0

2. 从github上复制代码

  ```
  git clone git@github.com:waxcloud2021/discord.git
  ```

3. 安装运行脚本需要的依赖包

  ```
  npm install
  ```

4. 配置好你使用代理的端口号（科学上网）

  ```
  proxy: "http://127.0.0.1:7890",
  ```

  端口号7890按实际修改

5. 如果你没有使用代理，跳过第4步，代码中做一下切换(两处)

  ```
  require("request").get(options, function (error, response, body) {
  // requestProxy.get(options, function (error, response, body) {
  ```

  ```
  require("request").post(options, function (error, response, body) {
  // requestProxy.post(options, function (error, response, body) {
  ```

6. 用浏览器打开 https://discord.com/login 登录你的discord帐号，登录成功后在你的主页里选中POAP-bot，这时浏览器的URL会显示 https://discord.com/channels/@me/xxxxxxxxxxxxxxxxxx (18位数字)，记下这18位数字(频道id)
 
![POAP bot](https://github.com/waxcloud2021/discord/blob/master/poap_bot.jpg)

  (在主页里添加POAP-bot步骤略)

7. 编辑discord.txt文件
  ```
  帐号1|密码1|上面的18位数字
  ```

8. 如果有多个discord帐号，重复6、7步，最终生成一个完整的discord.txt文件。此操作只需做一次

9. 用和步骤6同一台电脑同一个IP运行脚本(避免脚本登录时出现captcha required错误)

  ```
  node discord 暗语
  ```
  脚本依次登录discord.txt文件里帐号并向POAP-bot发送暗语以获得领取POAP的code. 运行结果保存在 暗语.txt文件中

  * 得到code后如何快速claim见 https://github.com/waxcloud2021/poap 脚本

10. 如果脚本在登录某账号时出现captcha required错误，目前没有好的解决方案，需要人工多次登录，直到discord不再要求captcha验证(?)

11. 阅读脚本源码你有所收获或者运行脚本为你节省了时间，自愿捐赠。本人账号地址：0xb0ba5ceca5a2fac643febc2f9f3ac4a53162f384, 各链通用. 谢谢！

![POAP bot](https://github.com/waxcloud2021/discord/blob/master/address.jpg)

  * 0xb0ba5ceca5a2fac643febc2f9f3ac4a53162f384


