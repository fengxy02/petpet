import { SaveData } from "../data/types";
import { PreferenceSystem } from "./PreferenceSystem";
import { SummarySystem } from "./SummarySystem";

export class GameFlowSystem {
  static getEntryScene(save: SaveData): string {
    if (save.isFirstLaunch && !save.openingStoryCompleted) return "OpeningStoryScene";
    if (!save.seedPlanted) return "SeedRitualScene";
    if (SummarySystem.needsSummary(save)) return "DailySummaryScene";
    if (save.dayCount >= 7 && !save.adultFormGenerated) return "AdultFormScene";
    if (PreferenceSystem.shouldAskToday(save)) return "QuestionScene";
    return "MainRoomScene";
  }

  static getAfterSummaryScene(save: SaveData): string {
    if (save.dayCount >= 7 && !save.adultFormGenerated) return "AdultFormScene";
    if (PreferenceSystem.shouldAskToday(save)) return "QuestionScene";
    return "MainRoomScene";
  }
}
