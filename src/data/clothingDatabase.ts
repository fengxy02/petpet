import { ClothingItem, ClothingSlot } from "./types";

export const clothingDatabase: ClothingItem[] = [
  { id: "hat_small_cap", name: "小帽子", slot: ClothingSlot.Hat, imageKey: "clothing_hat_small_cap", unlocked: true },
  { id: "neck_soft_scarf", name: "小围巾", slot: ClothingSlot.NeckAccessory, imageKey: "clothing_neck_soft_scarf", unlocked: true },
  { id: "body_tiny_bag", name: "小背包", slot: ClothingSlot.BodyAccessory, imageKey: "clothing_body_tiny_bag", unlocked: true },
  { id: "head_star", name: "头顶星星", slot: ClothingSlot.HeadAccessory, imageKey: "clothing_head_star", unlocked: true }
];

export const defaultUnlockedClothingIds = clothingDatabase.filter((item) => item.unlocked).map((item) => item.id);

export const defaultEquippedClothingBySlot: Record<string, string | null> = {
  [ClothingSlot.Hat]: null,
  [ClothingSlot.HeadAccessory]: null,
  [ClothingSlot.NeckAccessory]: null,
  [ClothingSlot.BodyAccessory]: null
};
