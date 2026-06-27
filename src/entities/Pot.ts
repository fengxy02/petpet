import Phaser from "phaser";
import { getPotPlacementForStage } from "../data/roomLayout";
import { GrowthStage, PotSaveData } from "../data/types";
import { GrowthSystem } from "../systems/GrowthSystem";
import { DepthSorter } from "../utils/DepthSorter";

export class Pot extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;
  private save: PotSaveData;

  constructor(scene: Phaser.Scene, save: PotSaveData, stage: GrowthStage) {
    super(scene, save.x, save.y);
    this.save = save;
    this.sprite = scene.add.sprite(0, 0, GrowthSystem.getPotTextureForStage(stage)).setOrigin(0.5, 1).setScale(save.scale);
    this.add(this.sprite);
    scene.add.existing(this);
    this.applyDepthForStage(stage);
  }

  setStage(stage: GrowthStage): void {
    const key = GrowthSystem.getPotTextureForStage(stage);
    this.sprite.setTexture(key);
    this.save.currentTextureKey = key;
    this.applyDepthForStage(stage);
  }

  moveToBalcony(onComplete?: () => void): void {
    this.moveToRoomPoint(onComplete, GrowthStage.SproutSmall);
  }

  moveToRoomPoint(onComplete?: () => void, stage = GrowthStage.SeedInPot): void {
    const placement = getPotPlacementForStage(stage);
    this.scene.tweens.add({
      targets: this,
      x: placement.x,
      y: placement.y,
      scaleX: placement.scale,
      scaleY: placement.scale,
      duration: 900,
      ease: "Sine.easeInOut",
      onUpdate: () => this.applyDepthForStage(stage),
      onComplete: () => {
        this.save.x = placement.x;
        this.save.y = placement.y;
        this.save.scale = placement.scale;
        this.applyDepthForStage(stage);
        onComplete?.();
      }
    });
  }

  syncToStagePlacement(stage: GrowthStage): void {
    const placement = getPotPlacementForStage(stage);
    this.setPosition(placement.x, placement.y);
    this.setScale(placement.scale);
    this.save.x = placement.x;
    this.save.y = placement.y;
    this.save.scale = placement.scale;
    this.applyDepthForStage(stage);
  }

  private applyDepthForStage(stage: GrowthStage): void {
    const placement = getPotPlacementForStage(stage);
    if (stage === GrowthStage.SeedInPot) {
      DepthSorter.applyByY(this);
      return;
    }
    this.setDepth(placement.depth);
  }
}
