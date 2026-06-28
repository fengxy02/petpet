import { DailySummary, LetterData, SaveData } from "../data/types";

export class SummarySystem {
  static needsSummary(save: SaveData): boolean {
    const sourceDay = save.dayCount - 1;
    if (sourceDay < 1) return false;
    if (sourceDay === 1 && save.openingStoryCompleted) return false;
    return save.letters.some((letter) => letter.day === sourceDay) && !save.summaries.some((summary) => summary.sourceDay === sourceDay);
  }

  static async createSummary(save: SaveData): Promise<DailySummary | null> {
    const sourceDay = save.dayCount - 1;
    const letter = save.letters.find((item) => item.day === sourceDay);
    if (!letter) return null;
    const existing = save.summaries.find((summary) => summary.sourceDay === sourceDay);
    if (existing) return existing;
    const summaryText = await this.generateText(letter);
    const summary: DailySummary = {
      sourceDay,
      summaryText,
      tags: letter.extractedTags,
      read: false
    };
    save.summaries.push(summary);
    return summary;
  }

  static markRead(save: SaveData, sourceDay: number): void {
    const summary = save.summaries.find((item) => item.sourceDay === sourceDay);
    if (summary) summary.read = true;
  }

  private static async generateText(letter: LetterData): Promise<string> {
    if (import.meta.env.VITE_ENABLE_AI_SUMMARY === "true" && import.meta.env.VITE_SUMMARY_API_URL) {
      try {
        const response = await fetch(import.meta.env.VITE_SUMMARY_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_SUMMARY_API_KEY ? `Bearer ${import.meta.env.VITE_SUMMARY_API_KEY}` : ""
          },
          body: JSON.stringify({ content: letter.content, tags: letter.extractedTags })
        });
        if (response.ok) {
          const data = (await response.json()) as { summary?: string };
          if (data.summary) return data.summary;
        }
      } catch {
        // Fall through to local rules. The saved result still stays deterministic.
      }
    }
    return this.generateLocalText(letter);
  }

  private static generateLocalText(letter: LetterData): string {
    const tags = new Set(letter.extractedTags);
    if (tags.has("comfort")) {
      return "它好像记住了你昨天说的疲惫。今天它在床边停了很久，像是在提醒你，也可以慢慢休息一下。";
    }
    if (tags.has("happy")) {
      return "它把你昨天说的开心悄悄收进了小花盆旁边。今天屋子里的光也像轻了一点，它似乎很期待继续陪你。";
    }
    if (tags.has("growth")) {
      return "它记住了你提到的努力和目标。今天它在书桌旁认真待了一会儿，像是在给你准备一份安静的鼓励。";
    }
    if (tags.has("accompany")) {
      return "它好像听懂了你说的孤单。今天它没有走远，只是在房间里慢慢绕着你常看的地方停留。";
    }
    if (tags.has("travel")) {
      return "它记住了远方和风景这样的词。今天它看阳台外看了很久，像在想象一条柔软的小路。";
    }
    if (tags.has("craft")) {
      return "它对你昨天提到的制作和礼物很感兴趣。今天书桌上多了一点细小的纸屑，看起来像某种小小的练习。";
    }
    return "它把你昨天写下的话放得很轻。今天它还是慢慢长着，也慢慢学会把你的日子记在心里。";
  }
}
