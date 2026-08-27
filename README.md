# 星语空间：哥，如果你还记得我

一款以 2010 年中文互联网空间为舞台的道家宇宙恐怖 ARG 网页游戏。玩家程砚寻找一个被世界彻底遗忘的弟弟，却逐渐发现自己的调查行为正在完成一场数字招魂。

## 在线游玩

- 游戏：https://hasai666.github.io/arg/
- 完整通关秘籍：https://hasai666.github.io/arg/walkthrough.html

## 本地运行

    npm install
    npm run dev

生产构建与内容检查：

    npm test

构建产物写入 dist/。项目使用相对资源路径，可以直接部署到 GitHub Pages 的 /arg/ 子路径。

## 游戏内容

- 5 个章节
- 12 个主恢复任务、2 份可选档案与 7 段人物边角记录
- 7 名测试群角色与“第八位访客”
- 8 张写实照片线索：家庭空位、异常影子、旧自拍与纸质档案
- 藏在装扮说明、文件属性等页面边角的三层旁证
- 自动存档、章节快照、导入导出
- 《归人》《封名》《换籍》《开籍》四个结局
- 桌面优先，移动端可完整通关

## 项目文件

- src/：React/TypeScript 游戏源码
- public/walkthrough.html：自包含通关秘籍
- docs/specs/2026-08-27-xingyu-space-arg-design.html：完整设计规格
- .github/workflows/deploy-pages.yml：GitHub Pages 自动部署

所有人物与平台均为虚构；照片由生成式图像模型制作，不对应真实人物或事件。
