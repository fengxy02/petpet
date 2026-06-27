import { LetterData, SaveData } from "../data/types";

const keywordRules: Array<{ tag: string; words: string[] }> = [
  { tag: "comfort", words: ["累", "压力", "难过", "焦虑"] },
  { tag: "happy", words: ["开心", "期待", "喜欢"] },
  { tag: "growth", words: ["学习", "努力", "目标", "考试"] },
  { tag: "accompany", words: ["孤独", "一个人", "陪我"] },
  { tag: "travel", words: ["旅行", "远方", "风景", "出去"] },
  { tag: "craft", words: ["做", "画", "写", "礼物", "手工"] },
  { tag: "sleep", words: ["睡觉", "休息", "困"] },
  { tag: "exercise", words: ["运动", "跑步", "健身"] },
  { tag: "read", words: ["书", "阅读", "学习"] }
];

export class LetterSystem {
  static hasLetterForToday(save: SaveData): boolean {
    return save.letters.some((letter) => letter.day === save.dayCount);
  }

  static getTodayLetter(save: SaveData): LetterData | undefined {
    return save.letters.find((letter) => letter.day === save.dayCount);
  }

  static submitLetter(save: SaveData, content: string): LetterData {
    const trimmed = content.trim();
    if (!trimmed) throw new Error("empty letter");
    if (this.hasLetterForToday(save)) throw new Error("letter already exists");
    const extractedTags = this.extractTags(trimmed);
    const letter: LetterData = {
      day: save.dayCount,
      content: trimmed,
      createdAt: new Date().toISOString(),
      extractedTags
    };
    save.letters.push(letter);
    this.applyTags(save, extractedTags);
    save.pet.intimacy = Math.min(100, save.pet.intimacy + 8);
    save.pet.mood = Math.min(100, save.pet.mood + 3);
    return letter;
  }

  static extractTags(content: string): string[] {
    const tags = new Set<string>();
    for (const rule of keywordRules) {
      if (rule.words.some((word) => content.includes(word))) {
        tags.add(rule.tag);
      }
    }
    if (tags.size === 0) tags.add("gentle");
    return [...tags];
  }

  static applyTags(save: SaveData, tags: string[]): void {
    for (const tag of tags) {
      save.preferences.tags[tag] = (save.preferences.tags[tag] ?? 0) + 1;
    }
  }
}
