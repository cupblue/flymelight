#Flyme Light v1.0.1
###前端自动化解决方案


## Documentation - 使用步骤

说明：/src为开发环境目录，/dist为文件生成目录，/publish为文件发布目录。

- 下载后进入根目录安装相关npm包:
  - 命令：npm install
- 在src命令下创建你的项目，目录形式请参考内部demo，然后就可以开始写代码了:
  - CSS预处理器默认采用sass，编译使用compass，请在sass目录下写css
  - 快速创建reset样式：@import 'compass/reset';
  - 可使用compass的工具库，支持浏览器前缀自动补全，需要在.scss文件头部引入@import "compass/css3";
  - sass 依赖于ruby，请ruby官网下载安装ruby，然后再安装sass和compass。如:gem install sass

- 代码调试：执行以下任务可开启监听功能，实时刷新浏览器页面。
  - 命令：grunt mylivedev
  - 默认打开index.html页面，若没有则显示项目当前的文件目录结构。

- 发布：文件压缩、合并、打包等，使用以下命令：
  - 全静态页面，无动态数据，无须后台开发人员二次开发：  grunt default
  - 动态页面，需要后台人员二次开发： grunt statictask

- 注：css与js压缩合并后文件名有变动，请手动修改/dist与/publish目录下html文件的引用地址，再手动压缩。后续会加入自动更新文件名功能。

## Examples

开发过程中，也可单独使用所定义的任务命令，如:

- 清理发布目录：
  - grunt clean:release

- png透明图片，格式转为webp：
  - grunt imagemin:somewebp (可修改Gruntfile.js该任务定义，只对若干图片进行压缩)
  - grunt imagemin:webp (压缩图片目录下所有.png图片)

- 合并/js/目录下所有.js文件为main.js
  - grunt concat:js

- 打包压缩发布，压缩格式为.zip
  - grunt compress 或 grunt compress:main

## Release History - 更新历史

- v1.0.0 - 项目初建

=======
# flymelight
前端自动化解决方案 - 构建方便可用的Grunt前端自动化开发环境，快速部署，高效开发。
>>>>>>> 1daddfeb4d176899d8c2c6821f6b53e8ae66213e
