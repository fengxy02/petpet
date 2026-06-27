import { createDefaultSave, SAVE_VERSION } from "../data/defaultSave";
import { clampPointToSingleFloor, getPotPlacementForStage, isDefaultPlacedFurnitureLayout, normalizeSingleFloorFurniture } from "../data/roomLayout";
import { GrowthStage, SaveData } from "../data/types";
import { AdultFormGenerator } from "./AdultFormGenerator";
import { DateSystem } from "./DateSystem";
import { GrowthSystem } from "./GrowthSystem";

export const SAVE_KEY = "spring_bud_letter_save_v1";

export class SaveSystem {
  static createNewSave(): SaveData {
    const save = createDefaultSave(DateSystem.getLocalDateString());
    this.saveGame(save);
    return save;
  }

  static loadSave(): SaveData | null {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
      return this.migrateSaveIfNeeded(JSON.parse(raw) as Partial<SaveData>);
    } catch {
      return null;
    }
  }

  static saveGame(data: SaveData): void {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }

  static clearSave(): void {
    localStorage.removeItem(SAVE_KEY);
  }

  static hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  }

  static migrateSaveIfNeeded(data: Partial<SaveData>): SaveData {
    const base = createDefaultSave(DateSystem.getLocalDateString());
    const stageForLayout = typeof data.dayCount === "number" ? GrowthSystem.getStageForDay(data.dayCount) : (data.growthStage ?? base.growthStage);
    const shouldResetRoomPlacement = (data.version ?? 0) < SAVE_VERSION;
    const furnitureItems = shouldResetRoomPlacement && isDefaultPlacedFurnitureLayout(data.room?.furnitureItems) ? undefined : data.room?.furnitureItems;
    const merged: SaveData = {
      ...base,
      ...data,
      pet: { ...base.pet, ...data.pet },
      pot: { ...base.pot, ...data.pot },
      preferences: { ...base.preferences, ...data.preferences },
      room: {
        ...base.room,
        ...data.room,
        furnitureItems: normalizeSingleFloorFurniture(furnitureItems, stageForLayout, shouldResetRoomPlacement)
      },
      equippedClothingBySlot: {
        ...base.equippedClothingBySlot,
        ...(data.equippedClothingBySlot ?? {})
      },
      version: SAVE_VERSION
    };
    const petPoint = clampPointToSingleFloor(merged.pet);
    merged.pet.x = petPoint.x;
    merged.pet.y = petPoint.y;
    merged.pet.currentFloor = 1;
    GrowthSystem.updateSaveGrowth(merged);
    const potPlacement = getPotPlacementForStage(merged.growthStage);
    merged.pot.x = potPlacement.x;
    merged.pot.y = potPlacement.y;
    merged.pot.scale = potPlacement.scale;
    if (merged.growthStage === GrowthStage.AdultPet || merged.adultFormGenerated || merged.adultForm) {
      const savedFormId = merged.adultForm?.formId ?? merged.pet.adultFormId;
      merged.adultForm = savedFormId && AdultFormGenerator.hasForm(savedFormId) ? AdultFormGenerator.fromPreference(savedFormId) : AdultFormGenerator.generate(merged);
      merged.pet.adultFormId = merged.adultForm.formId;
    }
    this.saveGame(merged);
    return merged;
  }
}
