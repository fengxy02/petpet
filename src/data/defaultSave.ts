import { AssetKeys } from "../utils/AssetKeys";
import { defaultEquippedClothingBySlot, defaultUnlockedClothingIds } from "./clothingDatabase";
import { defaultStoredFurnitureItems } from "./furnitureDatabase";
import { ROOM_LAYOUT, cloneFurnitureItems, getPotPlacementForStage } from "./roomLayout";
import { GrowthStage, PetState, SaveData } from "./types";

export const SAVE_VERSION = 6;

export function createDefaultSave(dateString: string): SaveData {
  const initialPotPlacement = getPotPlacementForStage(GrowthStage.SeedInPot);
  return {
    version: SAVE_VERSION,
    createdAt: new Date().toISOString(),
    lastLoginDate: dateString,
    currentDate: dateString,
    dayCount: 0,
    seedPlanted: false,
    growthStage: GrowthStage.SeedInPot,
    pet: {
      mood: 70,
      energy: 75,
      intimacy: 0,
      currentFloor: 1,
      x: ROOM_LAYOUT.petStartPoint.x,
      y: ROOM_LAYOUT.petStartPoint.y,
      currentState: PetState.Idle
    },
    pot: {
      x: initialPotPlacement.x,
      y: initialPotPlacement.y,
      scale: initialPotPlacement.scale,
      currentTextureKey: AssetKeys.Growth.PotEmpty
    },
    adultFormGenerated: false,
    adultFormLocked: false,
    rerollUsed: false,
    lastLoginProgress: null,
    letters: [],
    summaries: [],
    preferences: {
      tags: {},
      answers: []
    },
    collections: [],
    interactionRecords: [],
    room: {
      furnitureItems: cloneFurnitureItems(defaultStoredFurnitureItems)
    },
    unlockedClothingIds: defaultUnlockedClothingIds,
    equippedClothingBySlot: { ...defaultEquippedClothingBySlot }
  };
}
