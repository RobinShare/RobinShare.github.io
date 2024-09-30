# RobinShare Blog Theme

[![Build Status](https://travis-ci.org/pages-themes/cayman.svg?branch=master)](https://travis-ci.org/pages-themes/cayman) [![Gem Version](https://badge.fury.io/rb/jekyll-theme-cayman.svg)](https://badge.fury.io/rb/jekyll-theme-cayman)

*Cayman是GitHub页主题. 你可以 [预览主题样式](http://pages-themes.github.io/cayman), 或者直接 [使用该主题样式](#usage).*

![Thumbnail of cayman](thumbnail.png)

## 使用方法

如何使用Cayman主题样式:

1. 添加以下内容到你的站配置文件 `_config.yml`:

   ```yml
    theme: jekyll-theme-cayman
   ```

2. 自己喜欢, 如果你想在自己计算机上预览主题样式效果, 添加以下内容到你的站配置文件 `Gemfile`:

   ```ruby
    gem "github-pages", group: :jekyll_plugins
   ```


## 自定义

### 变量配置

如果要设置你的站配置文件 `_config.yml`，Cayman主题将支持以下配置变量 :

```yml
title: [The title of your site]
description: [A short description of your site's purpose]
```

此外，你可以选择性配置以下可选配置变量：

```yml
show_downloads: ["true" or "false" to indicate whether to provide a download URL]
google_analytics: [Your Google Analytics tracking ID]
```

### 样式页

如果你想添加你的自定义样式的话，按以下步骤进行:

1. 在你的站创建一个名为`/assets/css/style.scss`的文件
2. 添加以下内容到文件顶部，如下所示：
   ```scss
    ---
    ---

    @import "{{ site.theme }}";
   ```
3. 紧接把你想要的自定义的CSS (或 Sass, 包括 imports) 添加到`@import`该行后面

### 布局

如果你想改变主题的HTML布局的话，按以下步骤进行:

1. 从主题的repository中[拷贝源模板](https://github.com/pages-themes/cayman/blob/master/_layouts/default.html) <br />(*提示: 点击"raw" 更易拷贝*)
2. 在你的站创建一个名为`/_layouts/default.html`的文件
3. 第一步是粘贴默认布局的拷贝内容
4. 自定义你想要的布局

## 路线图

阅读 [开源组织](https://github.com/pages-themes/cayman/issues) 以了解主题的相关特性 .

## 项目目的

Cayman主题意在帮助GitHub Pages用户简易快速建立自己的第一(百)个网站。 该主题主要迎合大多数用户的需要，让用户跳出框架，以简单化替代复杂化。同时，提供用户额外完全可选的机会以让他们实现一些特殊需求或更加灵活的自定义想要的主题（如天津自定义CSS或修改默认布局）。这看起是个很不错的主题，应该是无可厚非的。

## 贡献

有兴趣为Cayman主题贡献一份吗? 我们很希望你的帮忙。Cayman是一个开源项目，每次的贡献者都是像你这样的人。阅读 [贡献文档](CONTRIBUTING.md) 让你知道如何把你的贡献分享出来。

### 本地预览主题

如果你想在本地预览主题 (例如, 在修改的过程中)，按以下步骤进行:

1. 克隆下载主题的repository (`git clone https://github.com/pages-themes/cayman`)
2. `cd` 到主题的当前路径
3. 运行 `script/bootstrap` 来安装必要的依赖
4. 运行 `bundle exec jekyll serve` 开始预览服务器
5. 浏览器通过 [`localhost:4000`](http://localhost:4000) 端口预览主题

### 测试

该主题包含一个最小的测试套件，可以判断使用该主题的站是否搭建成功。运行`script/cibuild`，获取测试结果。在脚本测试之前，你需要运行 `script/bootstrap`一次，不然脚本测试不工作。