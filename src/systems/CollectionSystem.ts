import { CollectionItemData, SaveData } from "../data/types";

export class CollectionSystem {
  static addCollection(save: SaveData, item: CollectionItemData): void {
    if (!save.collections.some((existing) => existing.id === item.id)) {
      save.collections.push(item);
    }
  }

  static getCollections(save: SaveData): CollectionItemData[] {
    return [...save.collections].sort((a, b) => a.dayObtained - b.dayObtained);
  }
}
