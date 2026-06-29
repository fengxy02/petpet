import Phaser from "phaser";
import { ClothingSlot, GrowthStage } from "../data/types";
import { SaveSystem } from "../systems/SaveSystem";
import { WardrobeSystem } from "../systems/WardrobeSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { UIPanel } from "../ui/UIPanel";
import { AssetKeys, getAdultIdleAnimationKey, getAdultIdleKey, MushroomAnimationKeys, MushroomFrames } from "../utils/AssetKeys";

const slots = [ClothingSlot.Hat, ClothingSlot.HeadAccessory, ClothingSlot.NeckAccessory, ClothingSlot.BodyAccessory] as const;

type WardrobeSlot = (typeof slots)[number];
type Save = NonNullable<ReturnType<typeof SaveSystem.loadSave>>;

const slotLabels: Record<WardrobeSlot, string> = {
  [ClothingSlot.Hat]: "帽子",
  [ClothingSlot.HeadAccessory]: "头饰",
  [ClothingSlot.NeckAccessory]: "颈饰",
  [ClothingSlot.BodyAccessory]: "身体"
};

export class WardrobeScene extends Phaser.Scene {
  constructor() {
    super("WardrobeScene");
  }

  create(): void {
    const save = SaveSystem.loadSave();
    if (!save || !this.canUseWardrobe(save)) {
      this.scene.start("MainRoomScene");
      return;
    }

    const isAdult = save.growthStage === GrowthStage.AdultPet;
    AnimalIslandTheme.sceneBackground(this);
    new UIPanel(this, 640, 360, 1040, 610, isAdult ? "成年体换装" : "幼体换装");

    const previewBg = this.add.graphics();
    AnimalIslandTheme.drawCard(previewBg, 255, 220, 250, 320, {
      fill: AnimalIslandTheme.colors.creamSoft,
      border: AnimalIslandTheme.colors.borderLight,
      radius: 26,
      alpha: 0.78
    });
    this.drawBasePreview(save, isAdult);
    this.drawEquippedPreview(save, isAdult);
    this.drawPetpetReferencePreview();
    this.drawSlotRows(save);
    new UIButton(this, 640, 635, "回到小屋", () => this.scene.start("MainRoomScene"), 220, 58, { variant: "primary" });
  }

  private canUseWardrobe(save: Save): boolean {
    return save.growthStage === GrowthStage.BabyPet || (save.growthStage === GrowthStage.AdultPet && save.adultFormGenerated);
  }

  private drawBasePreview(save: Save, isAdult: boolean): void {
    const texture = isAdult ? getAdultIdleKey(save.adultForm?.formId) : MushroomFrames.idle[0];
    const sprite = this.add.sprite(380, 505, texture).setOrigin(0.5, 1).setScale(isAdult ? 1.02 : 0.72);
    sprite.play(isAdult ? getAdultIdleAnimationKey(save.adultForm?.formId) : MushroomAnimationKeys.Idle, true);
    this.add
      .text(380, 548, isAdult ? "成年体预览" : "幼体预览", AnimalIslandTheme.textStyle(17, AnimalIslandTheme.colors.mutedText, { fontStyle: "bold" }))
      .setOrigin(0.5);
  }

  private drawSlotRows(save: Save): void {
    slots.forEach((slot, slotIndex) => {
      const rowY = 150 + slotIndex * 88;
      const rowBg = this.add.graphics();
      AnimalIslandTheme.drawCard(rowBg, 585, rowY, 370, 62, {
        fill: AnimalIslandTheme.colors.creamSoft,
        border: AnimalIslandTheme.colors.borderLight,
        radius: 18,
        alpha: 0.86
      });
      this.add.text(610, rowY + 20, slotLabels[slot], AnimalIslandTheme.textStyle(21, AnimalIslandTheme.colors.text, { fontStyle: "bold" }));
      const items = WardrobeSystem.getItemsBySlot(save, slot);
      items.forEach((item, itemIndex) => {
        const equipped = save.equippedClothingBySlot[slot] === item.id;
        new UIButton(
          this,
          775 + itemIndex * 168,
          178 + slotIndex * 88,
          equipped ? `${item.name} ✓` : item.name,
          () => {
            if (equipped) WardrobeSystem.unequip(save, slot);
            else WardrobeSystem.equip(save, item.id);
            SaveSystem.saveGame(save);
            this.scene.restart();
          },
          154,
          48,
          { variant: equipped ? "primary" : "default", fontSize: 16 }
        );
      });
    });
  }

  private drawPetpetReferencePreview(): void {
    const keys = [
      [AssetKeys.ClothingPreview.PersonFront, AssetKeys.ClothingPreview.HatFront],
      [AssetKeys.ClothingPreview.PersonSide, AssetKeys.ClothingPreview.HatSide],
      [AssetKeys.ClothingPreview.PersonBack, AssetKeys.ClothingPreview.HatBack]
    ];
    keys.forEach(([personKey, hatKey], index) => {
      const x = 295 + index * 85;
      this.add.sprite(x, 602, personKey).setOrigin(0.5, 1).setScale(0.25);
      this.add.sprite(x, 602, hatKey).setOrigin(0.5, 1).setScale(0.25);
    });
  }

  private drawEquippedPreview(save: Save, isAdult: boolean): void {
    const adultOffsets: Partial<Record<ClothingSlot, { x: number; y: number; scale: number }>> = {
      [ClothingSlot.Hat]: { x: 380, y: 318, scale: 1.15 },
      [ClothingSlot.HeadAccessory]: { x: 438, y: 348, scale: 1.1 },
      [ClothingSlot.NeckAccessory]: { x: 380, y: 420, scale: 1.05 },
      [ClothingSlot.BodyAccessory]: { x: 428, y: 438, scale: 1.05 }
    };
    const babyOffsets: Partial<Record<ClothingSlot, { x: number; y: number; scale: number }>> = {
      [ClothingSlot.Hat]: { x: 380, y: 372, scale: 0.78 },
      [ClothingSlot.HeadAccessory]: { x: 422, y: 388, scale: 0.7 },
      [ClothingSlot.NeckAccessory]: { x: 380, y: 432, scale: 0.7 },
      [ClothingSlot.BodyAccessory]: { x: 420, y: 448, scale: 0.7 }
    };
    const offsets = isAdult ? adultOffsets : babyOffsets;
    for (const item of WardrobeSystem.getEquippedItems(save)) {
      const offset = offsets[item.slot];
      if (!offset) continue;
      this.add.sprite(offset.x, offset.y, item.imageKey).setScale(offset.scale);
    }
  }
}
