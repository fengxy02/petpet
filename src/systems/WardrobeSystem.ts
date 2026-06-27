import { clothingDatabase } from "../data/clothingDatabase";
import { ClothingItem, ClothingSlot, SaveData } from "../data/types";

export class WardrobeSystem {
  static getUnlockedItems(save: SaveData): ClothingItem[] {
    return clothingDatabase.filter((item) => save.unlockedClothingIds.includes(item.id));
  }

  static getItemsBySlot(save: SaveData, slot: ClothingSlot): ClothingItem[] {
    return this.getUnlockedItems(save).filter((item) => item.slot === slot);
  }

  static equip(save: SaveData, itemId: string): void {
    const item = clothingDatabase.find((candidate) => candidate.id === itemId);
    if (!item || !save.unlockedClothingIds.includes(item.id)) return;
    save.equippedClothingBySlot[item.slot] = item.id;
  }

  static unequip(save: SaveData, slot: ClothingSlot): void {
    save.equippedClothingBySlot[slot] = null;
  }

  static getEquippedItems(save: SaveData): ClothingItem[] {
    return Object.values(save.equippedClothingBySlot)
      .filter((id): id is string => Boolean(id))
      .map((id) => clothingDatabase.find((item) => item.id === id))
      .filter((item): item is ClothingItem => Boolean(item));
  }
}
