import { QuestionData } from "./types";

export const questionDatabase: QuestionData[] = [
  {
    id: "room_wish",
    text: "如果它以后有自己的房间，你希望它更喜欢什么？",
    options: [
      { id: "read", label: "安静看书", tags: ["read", "quiet"] },
      { id: "exercise", label: "到处运动", tags: ["exercise", "active"] },
      { id: "sleep", label: "睡懒觉", tags: ["sleep", "rest"] },
      { id: "craft", label: "做手工", tags: ["craft"] },
      { id: "travel", label: "出去旅行", tags: ["travel"] }
    ]
  },
  {
    id: "companion_style",
    text: "你希望它陪你的方式更像什么？",
    options: [
      { id: "quiet", label: "安静陪着", tags: ["accompany", "quiet"] },
      { id: "happy", label: "主动逗你开心", tags: ["happy", "active"] },
      { id: "growth", label: "一起努力", tags: ["growth", "read"] },
      { id: "discover", label: "带你发现新东西", tags: ["travel", "curious"] }
    ]
  },
  {
    id: "gift_wish",
    text: "如果它带回来一个礼物，你更喜欢？",
    options: [
      { id: "postcard", label: "明信片", tags: ["travel"] },
      { id: "craft", label: "小手工", tags: ["craft"] },
      { id: "flower", label: "一朵花", tags: ["comfort", "healing"] },
      { id: "note", label: "一张便条", tags: ["accompany", "read"] }
    ]
  }
];
