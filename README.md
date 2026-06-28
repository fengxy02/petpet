# petpet

一个纯前端 Web 版虚拟宠物养成游戏，使用 Vite、TypeScript 和 Phaser 3 构建。

## 运行

```bash
npm install
npm run dev
```

本地开发地址通常是 `http://localhost:5173`。线上 GitHub Pages 固定地址计划为：

```text
https://fengxy02.github.io/petpet/
```

## 发布

构建命令已经使用 GitHub Pages 子路径：

```bash
npm run build
```

仓库改名为 `petpet` 后，GitHub Actions 会把 `dist` 发布到 Pages。

## 素材

本轮已把首页、房间、蘑菇宠物、Ian 成年体、家具、换装预览和信件背景素材接入到 `public/assets/`。房间初始不摆放家具，家具默认放在装饰库存里，玩家选择后才出现场景中。

存档 key：`spring_bud_letter_save_v1`
