# 阿里百秀

- 一个文章发布自媒体项目的后台管理系统
- 使用 `node + express` 进行服务器搭建
- 使用 `mysql` 作为数据库




## 项目描述

### 项目介绍

- 一个文章发布自媒体项目的后台管理系统，包含管理员的增删改查，文章和评论的增删改查，文章分类信息的增删改查，还有网站基本设置

### 项目描述

1. 使用服务端渲染技术完成的页面渲染
2. 页面中样式层主要使用的是 `bootstrap` UI框架完成，结合 `font-awesome` 字体图标库
3. 项目所有提示框使用 `layer-ui` 完成
4. 项目脚本文件主要使用 `jQuery` 完成
5. 前后台数据交互使用的是 `jQuery` 中的 `$.ajax` 完成
6. 前台数据渲染使用的是 `art-template` 完成
7. 使用 `jquery-validation` 完成表单验证
8. 使用 `jqPaginator` 完成的分页功能
9. 使用 `wangEditor` 进行文章编辑和添加时候的富文本编辑器功能
10. 服务端渲染页面使用的是 `node + express` 完成
11. 文件（图片等内容）上传使用的是 `FormData` 上传，后台使用 `multer` 进行数据接受及解析



## 项目目录结构

- 简单介绍一下项目目录结构

```Text
- controllers                           //=> 自定义控制器模块
  - api								    //=> 关于数据请求的控制器
  	+ categoriesCtrl.js 			    //=> 分类相关数据请求的控制器
  	+ commentsCtrl.js  				    //=> 评论相关数据请求的控制器
  	+ postsCtrl.js					    //=> 文章相关数据请求的控制器
  	+ profileCtrl.js  				    //=> 个人相关数据请求的控制器
  	+ slidesCtrl.js					    //=> 轮播图相关数据请求的控制器
  	+ usersCtrl.js   				    //=> 用户相关数据请求的控制器
  + adminCtrl.js					    //=> 后台管理系统页面请求相关的控制器
  + appCtrl.js						    //=> app.js 文件的控制器
  + indexCtrl.js					    //=> 前台各个页面请求的控制器
- data								    //=> 额外资料
  + 后台管理系统接口文档.md				 //=> 后台管理系统的接口文档
  + alishow.sql							//=> 项目的数据库文件
- middlewares							//=> 自定义中间件模块
  + middlewares_oa.js					//=> 后台管理系统统一使用的中间件
- models								//=> 自定义 model 模块
  - api									//=> 关于数据请求的 model
    + categoriesModel.js     			//=> 分类相关的数据请求 model
    + commentsmodel.js					//=> 评论相关的数据请求 model
    + indexModel.js						//=> 仪表盘页面的数据请求 model
    + postsModel.js						//=> 文章相关的数据请求 model
    + profileModel.js					//=> 个人相关的数据请求 model
    + slidesModel.js					//=> 轮播图相关的数据请求 model
    + usersModel.js						//=> 用户相关的数据请求 model
  + indexModel.js						//=> 前台展示首页的数据请求 model
- public								//=> 页面的静态资源文件
  - assets								//=> 静态资源
    - css      							//=> css 相关内容
    - img								//=> 图片相关内容
    - js								//=> js 相关内容
      - admin							//=> 后台管理系统的 js 文件
        + categories.js					//=> 分类页面的 js 文件
        + xxx.js						//=> 其他页面的 js 文件
      + index.js						//=> 前台展示首页的 js 文件
    - vendors							//=> 页面中使用的各种插件
  - uploads								//=> 上传文件的存储目录
    - postsArticleBodyPic				//=> 文章内容部分的图片
    - postsArticleShowPic				//=> 文章特色图片
    - profilePic						//=> 个人头像
    - slidesPic							//=> 轮播图图片
    + xxx.jpg							//=> 其他图片内容
- routes								//=> 自定义路由模块
  - api									//=> 数据相关路由
    + categories.js						//=> 分类相关路由
    + comments.js						//=> 评论相关路由
    + posts.js							//=> 文章相关路由
    + profile.js						//=> 个人中心相关路由
    + slides.js							//=> 轮播图相关路由
    + users.js							//=> 用户相关路由
  + admin.js							//=> 后台管理系用页面展示相关路由
  + idnex.js							//=> 前台展示页面相关路由
- utils									//=> 自定义工具库
  - db.js								//=> 数据库的操作文件
  - md5.js								//=> md5 加密操作文件
  - multer.js							//=> multer 操作文件
  - query.js							//=> 数据库操作封装文件
  - regexp.js							//=> 全局使用的正则文件
  - session.js							//=> session 配置文件
- views									//=> 静态页面
  - admin								//=> 后台管理系统相关页面
    - layouts							//=> 模板页面文件夹
      + layout.html						//=> 整体模板页
    + categories.html					//=> 分类页面
    + comments.html						//=> 评论页面
    + xxx.html							//=> 其他页面
  + detail.html							//=> 前台展示文章详细内容页面
  + index.html							//=> 前台展示首页
  + list.html							//=> 前台展示列表页面
+ app.js								//=> 服务器入口文件
+ config.js								//=> 服务器配置文件
+ package.json							//=> 项目说明文件
+ README.md								//=> 项目说明文档
```





## 启动项目

- 在 `github` 上下载项目源码
  - 地址：`sss`

  ```shell
  # 来到桌面（或者项目存储磁盘）
  $ cd desktop
  # 下载项目
  $ git clone
  ```

- 导入数据库文件

  - 将 `/data/alishow.sql` 文件导入自己的数据库中

- 修改数据库配置文件

  - 将 `config.js` 文件中的数据库信息进行修改

    ```javascript
    exports.dbConfig = {
      host: 'localhost',
      user: '自己的数据库名称',
      password: '自己的数据库密码',
      database: '导入 sql 文件时候的库名称'
    }
    ```

- 下载依赖项

  ```shell
  # 来到项目跟目录
  $ cd alishow
  # 下载项目依赖
  $ npm install
  ```

- 启动项目

  ```shell
  # 来到项目跟目录
  $ cd alishow
  # 启动项目
  $ npm start
  ```

- 打开浏览器访问地址

  - 前台地址： `localhost:8080`
  - 后台管理系统地址：`localhost:8080/admin/login`
  - 后台管理系统账号密码
    - 超管：`user: admin, password: 223322`
    - 其他用户： 用户名在用户模块自行查看，密码全都是 `223322`
