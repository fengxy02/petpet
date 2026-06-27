import { eventDatabase } from "../data/eventDatabase";
import { CollectionItemData, FurnitureType, SaveData } from "../data/types";
import { pickOne } from "../utils/MathUtils";

export type DailyEventResult = {
  checked: boolean;
  item: CollectionItemData | null;
  message?: string;
  forced: boolean;
};

export class RandomEventSystem {
  static tryGenerateDailyEvent(save: SaveData): DailyEventResult {
    if (save.dayCount < 4) return { checked: false, item: null, forced: false };
    if (save.interactionRecords.some((record) => record.day === save.dayCount && record.action === "DailyEventChecked")) {
      return { checked: false, item: null, forced: false };
    }
    if (save.collections.some((item) => item.dayObtained === save.dayCount)) {
      return { checked: false, item: null, forced: false };
    }
    const missStreak = this.getMissStreak(save);
    save.interactionRecords.push({
      day: save.dayCount,
      furnitureType: FurnitureType.Decoration,
      action: "DailyEventChecked",
      timestamp: new Date().toISOString()
    });
    const chance = this.getChance(save);
    const forced = missStreak >= 2;
    if (!forced && Math.random() > chance) {
      return {
        checked: true,
        item: null,
        message: this.getNoEventMessage(missStreak),
        forced: false
      };
    }
    const definition = this.pickDefinition(save);
    const item: CollectionItemData = {
      id: `${definition.id}_day_${save.dayCount}`,
      type: definition.type,
      name: definition.name,
      description: definition.description,
      imageKey: definition.imageKey,
      dayObtained: save.dayCount,
      createdAt: new Date().toISOString()
    };
    save.collections.push(item);
    return { checked: true, item, forced };
  }

  private static getChance(save: SaveData): number {
    let chance = 0.3;
    if ((save.preferences.tags.travel ?? 0) > 2) chance += 0.08;
    if ((save.preferences.tags.craft ?? 0) > 2) chance += 0.08;
    return Math.min(0.55, chance);
  }

  private static pickType(save: SaveData): "postcard" | "craft" {
    let postcard = 1 + (save.preferences.tags.travel ?? 0);
    let craft = 1 + (save.preferences.tags.craft ?? 0);
    const recent = save.interactionRecords.filter((record) => save.dayCount - record.day <= 2);
    postcard += recent.filter((record) => record.action === "Wander").length;
    craft += recent.filter((record) => record.furnitureType === FurnitureType.Desk || record.furnitureType === FurnitureType.Chair).length;
    return Math.random() * (postcard + craft) < postcard ? "postcard" : "craft";
  }

  private static pickDefinition(save: SaveData) {
    const type = this.pickType(save);
    const typeEvents = eventDatabase.filter((event) => event.type === type);
    const collectedDefinitionIds = new Set(save.collections.map((item) => this.getDefinitionId(item.id)));
    const unseen = typeEvents.filter((event) => !collectedDefinitionIds.has(event.id));
    return pickOne(unseen.length > 0 ? unseen : typeEvents);
  }

  private static getMissStreak(save: SaveData): number {
    const collectionDays = new Set(save.collections.map((item) => item.dayObtained));
    const checkedDays = [
      ...new Set(
        save.interactionRecords
          .filter((record) => record.action === "DailyEventChecked" && record.day < save.dayCount)
          .map((record) => record.day)
      )
    ].sort((a, b) => b - a);
    let streak = 0;
    for (const day of checkedDays) {
      if (collectionDays.has(day)) break;
      streak += 1;
    }
    return streak;
  }

  private static getDefinitionId(collectionId: string): string {
    return collectionId.split("_day_")[0];
  }

  private static getNoEventMessage(missStreak: number): string {
    if (missStreak === 0) return "它认真找了找，今天还没有带回新东西。";
    return "它把今天的小发现先藏在心里，也许明天会带回来给你看。";
  }
}
