# 春芽来信

一个纯前端 Web 版 2.5D 温馨虚拟宠物养成游戏 MVP。

## 运行方式

```bash
npm install
npm run dev
```

然后在浏览器打开 Vite 输出的本地地址，通常是 `http://localhost:5173`。

## 技术栈

- Vite
- TypeScript
- Phaser 3
- localStorage

存档 key：`spring_bud_letter_save_v1`

## 当前 MVP 流程

封面界面 -> 种子仪式 -> Day 1 到 Day 6 陪伴成长 -> Day 7 先阅读昨日小结 -> 成年体生成 -> 成年体换装、收藏、布置、日常互动。

跨天登录时每天只推进一个成长日，并在回到小屋时提示玩家，不会一次性跳过多天陪伴内容。成年体会根据写信关键词、每日问答、家具互动和收藏偏好生成不同形态。

开发模式下主房间右下角有 `Debug 下一天`，用于快速测试 Day 1 到 Day 7。

## 素材替换

把 PNG 放到 `public/assets/` 下的对应路径即可，例如：

- `public/assets/start/cover_background.png`
- `public/assets/growth/pot_soil.png`
- `public/assets/pet/baby/idle_0.png`
- `public/assets/pet/adult/healing_companion/idle_0.png`
- `public/assets/furniture/bed.png`
- `public/assets/ui/button.png`

如果图片不存在，游戏会通过 `src/utils/PlaceholderFactory.ts` 自动生成占位 Texture，不会因为缺素材中断流程。

## 可选日志总结 API

`.env` 已预留：

```env
VITE_SUMMARY_API_URL=
VITE_SUMMARY_API_KEY=
VITE_ENABLE_AI_SUMMARY=false
```

默认关闭 API，使用本地关键词规则生成第二天日志反馈。开启 API 后如果请求失败，也会回退本地规则，并把生成结果保存到 localStorage，避免刷新重复请求。
