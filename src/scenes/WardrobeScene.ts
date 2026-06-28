import Phaser from "phaser";
import { ClothingSlot } from "../data/types";
import { SaveSystem } from "../systems/SaveSystem";
import { WardrobeSystem } from "../systems/WardrobeSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { UIPanel } from "../ui/UIPanel";
import { AssetKeys, getAdultIdleKey } from "../utils/AssetKeys";

const slots = [ClothingSlot.Hat, ClothingSlot.HeadAccessory, ClothingSlot.NeckAccessory, ClothingSlot.BodyAccessory] as const;

type WardrobeSlot = (typeof slots)[number];

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
    if (!save || !save.adultFormGenerated) {
      this.scene.start("MainRoomScene");
      return;
    }
    AnimalIslandTheme.sceneBackground(this);
    new UIPanel(this, 640, 360, 1040, 610, "换装");
    const previewBg = this.add.graphics();
    AnimalIslandTheme.drawCard(previewBg, 255, 235, 250, 300, { fill: AnimalIslandTheme.colors.creamSoft, border: AnimalIslandTheme.colors.borderLight, radius: 26, alpha: 0.78 });
    this.add.sprite(380, 505, getAdultIdleKey(save.adultForm?.formId)).setOrigin(0.5, 1).setScale(1.05);
    this.drawEquippedPreview(save);
    this.drawPetpetReferencePreview();
    slots.forEach((slot, slotIndex) => {
      const rowY = 150 + slotIndex * 88;
      const rowBg = this.add.graphics();
      AnimalIslandTheme.drawCard(rowBg, 585, rowY, 370, 62, { fill: AnimalIslandTheme.colors.creamSoft, border: AnimalIslandTheme.colors.borderLight, radius: 18, alpha: 0.86 });
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
    new UIButton(this, 640, 635, "回到小屋", () => this.scene.start("MainRoomScene"), 220, 58, { variant: "primary" });
  }

  private drawPetpetReferencePreview(): void {
    const keys = [
      [AssetKeys.ClothingPreview.PersonFront, AssetKeys.ClothingPreview.HatFront],
      [AssetKeys.ClothingPreview.PersonSide, AssetKeys.ClothingPreview.HatSide],
      [AssetKeys.ClothingPreview.PersonBack, AssetKeys.ClothingPreview.HatBack]
    ];
    keys.forEach(([personKey, hatKey], index) => {
      const x = 295 + index * 85;
      this.add.sprite(x, 598, personKey).setOrigin(0.5, 1).setScale(0.28);
      this.add.sprite(x, 598, hatKey).setOrigin(0.5, 1).setScale(0.28);
    });
  }

  private drawEquippedPreview(save: NonNullable<ReturnType<typeof SaveSystem.loadSave>>): void {
    const offsets: Partial<Record<ClothingSlot, { x: number; y: number }>> = {
      [ClothingSlot.Hat]: { x: 380, y: 318 },
      [ClothingSlot.HeadAccessory]: { x: 438, y: 348 },
      [ClothingSlot.NeckAccessory]: { x: 380, y: 420 },
      [ClothingSlot.BodyAccessory]: { x: 428, y: 438 }
    };
    for (const item of WardrobeSystem.getEquippedItems(save)) {
      const offset = offsets[item.slot];
      if (!offset) continue;
      this.add.sprite(offset.x, offset.y, item.imageKey).setScale(1.2);
    }
  }
}
