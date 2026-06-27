import { RandomEventDefinition } from "./types";

export const postcardEvents: RandomEventDefinition[] = [
  {
    id: "postcard_001",
    type: "postcard",
    name: "蓝云明信片",
    description: "它今天带回来一张蓝色明信片，上面画着一朵歪歪扭扭的云。",
    imageKey: "collection_postcard_001"
  },
  {
    id: "postcard_002",
    type: "postcard",
    name: "窗外小路",
    description: "明信片上有一条奶油色的小路，像是从阳台一路延伸到远方。",
    imageKey: "collection_postcard_002"
  },
  {
    id: "postcard_003",
    type: "postcard",
    name: "晚霞邮戳",
    description: "这张明信片边角有一枚圆圆的晚霞邮戳，摸起来像温热的纸。",
    imageKey: "collection_postcard_003"
  }
];

export const craftEvents: RandomEventDefinition[] = [
  {
    id: "craft_001",
    type: "craft",
    name: "纸花小灯",
    description: "它用几片纸做了一盏小灯，光不亮，但看起来很认真。",
    imageKey: "collection_craft_001"
  },
  {
    id: "craft_002",
    type: "craft",
    name: "软软贴纸",
    description: "这是一枚形状不太规则的贴纸，像它偷偷练习了很久。",
    imageKey: "collection_craft_002"
  },
  {
    id: "craft_003",
    type: "craft",
    name: "小芽便签",
    description: "它在便签上画了一颗小芽，还把边角折成了圆圆的形状。",
    imageKey: "collection_craft_003"
  }
];

export const eventDatabase = [...postcardEvents, ...craftEvents];
