import { LoginProgressNotice, SaveData } from "../data/types";
import { GrowthSystem } from "./GrowthSystem";

export class DateSystem {
  static getLocalDateString(date = new Date()): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  static daysBetween(start: string, end: string): number {
    const startTime = new Date(`${start}T00:00:00`).getTime();
    const endTime = new Date(`${end}T00:00:00`).getTime();
    if (Number.isNaN(startTime) || Number.isNaN(endTime)) return 0;
    return Math.max(0, Math.round((endTime - startTime) / 86400000));
  }

  static applyLoginProgress(save: SaveData): LoginProgressNotice | null {
    const today = this.getLocalDateString();
    save.currentDate = today;
    const crossedDays = this.daysBetween(save.lastLoginDate, today);
    if (crossedDays <= 0 || !save.seedPlanted) return null;
    this.advanceOneDay(save, today);
    const notice = this.createLoginProgressNotice(today, crossedDays);
    save.lastLoginProgress = notice;
    return notice;
  }

  static advanceOneDay(save: SaveData, dateString = this.getLocalDateString()): void {
    if (!save.seedPlanted) return;
    save.dayCount += 1;
    save.lastLoginDate = dateString;
    save.currentDate = dateString;
    GrowthSystem.updateSaveGrowth(save);
  }

  static debugNextDay(save: SaveData): void {
    this.advancePreviewDay(save);
  }

  static advancePreviewDay(save: SaveData): void {
    const current = new Date(`${save.currentDate || this.getLocalDateString()}T00:00:00`);
    current.setDate(current.getDate() + 1);
    this.advanceOneDay(save, this.getLocalDateString(current));
  }

  private static createLoginProgressNotice(date: string, crossedDays: number): LoginProgressNotice {
    const message =
      crossedDays > 1
        ? `你离开了 ${crossedDays} 天，它把等待收得很轻。为了不错过陪伴，今天只向前长大了一小步。`
        : "新的一天到了。它把昨天的事记在心里，今天又慢慢长大了一点。";
    return {
      date,
      crossedDays,
      advancedDays: 1,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
  }
}
