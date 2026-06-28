import { LetterSystem } from "./LetterSystem";
import { SaveSystem } from "./SaveSystem";
import { SaveData } from "../data/types";

export type OpeningReply = {
  title: string;
  body: string;
};

export class OpeningReplySystem {
  static shouldShowFirstReply(save: SaveData): boolean {
    return save.openingStoryCompleted && save.dayCount === 2 && !save.firstReplyRead;
  }

  static getFirstReply(save: SaveData): OpeningReply {
    if (save.letters.some((letter) => letter.day === 1)) {
      return {
        title: "花盆旁边多了一张小纸条",
        body: "给照顾我的你：\n\n我还在土里，外面的声音有一点远。\n但是昨天，我好像听见你说话了。\n\n土壤很暖。\n我会努力长出来的。\n\n——还没有名字的小种子"
      };
    }
    return {
      title: "花盆旁边多了一张小纸条",
      body: "给路过这里的你：\n\n我在土里睡了一整晚。\n虽然还没有听见很多声音，但阳光落下来的时候，我觉得很安心。\n\n如果你愿意的话，今天可以和我说说话吗？\n\n——还没有名字的小种子"
    };
  }

  static markFirstReplyRead(save: SaveData): void {
    save.firstReplyRead = true;
    SaveSystem.saveGame(save);
  }

  static hasFirstDayLetter(save: SaveData): boolean {
    return save.dayCount === 1 && LetterSystem.hasLetterForToday(save);
  }
}
