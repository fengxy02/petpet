import { FurnitureSaveData, FurnitureType } from "./types";
import { cloneFurnitureItems, singleFloorStoredFurnitureItems } from "./roomLayout";

export const defaultStoredFurnitureItems: FurnitureSaveData[] = cloneFurnitureItems(singleFloorStoredFurnitureItems);
export const defaultFurnitureItems: FurnitureSaveData[] = cloneFurnitureItems(defaultStoredFurnitureItems);

export const furnitureLabels: Record<FurnitureType, string> = {
  [FurnitureType.Bed]: "小床",
  [FurnitureType.Chair]: "椅子",
  [FurnitureType.Desk]: "书桌",
  [FurnitureType.ExerciseEquipment]: "运动器材",
  [FurnitureType.FoodBowl]: "食盆",
  [FurnitureType.Toy]: "玩具",
  [FurnitureType.Pot]: "花盆",
  [FurnitureType.Sofa]: "沙发",
  [FurnitureType.Bookshelf]: "书架",
  [FurnitureType.Wardrobe]: "衣柜",
  [FurnitureType.Decoration]: "装饰"
};
