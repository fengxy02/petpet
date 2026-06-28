import { FurnitureSaveData, FurnitureType } from "./types";
import { cloneFurnitureItems, singleFloorStoredFurnitureItems } from "./roomLayout";

export const defaultStoredFurnitureItems: FurnitureSaveData[] = cloneFurnitureItems(singleFloorStoredFurnitureItems);
export const defaultFurnitureItems: FurnitureSaveData[] = cloneFurnitureItems(defaultStoredFurnitureItems);

export const furnitureLabels: Record<FurnitureType, string> = {
  [FurnitureType.Bed]: "床",
  [FurnitureType.Chair]: "椅子",
  [FurnitureType.Desk]: "桌子",
  [FurnitureType.ExerciseEquipment]: "跑步机",
  [FurnitureType.FoodBowl]: "食盆",
  [FurnitureType.Toy]: "玩具",
  [FurnitureType.Pot]: "花盆",
  [FurnitureType.Sofa]: "沙发",
  [FurnitureType.Bookshelf]: "小书架",
  [FurnitureType.Wardrobe]: "衣柜",
  [FurnitureType.Decoration]: "装饰",
  [FurnitureType.Rug]: "地毯",
  [FurnitureType.Painting]: "挂画",
  [FurnitureType.CoffeeTable]: "茶几",
  [FurnitureType.TvCabinet]: "电视机柜"
};
