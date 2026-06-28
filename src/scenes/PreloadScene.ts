import Phaser from "phaser";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import {
  AssetManifest,
  adultAnimationFormIds,
  getAdultClickAnimationKey,
  getAdultClickFrameKeys,
  getAdultWalkAnimationKey,
  getAdultWalkFrameKeys,
  MushroomAnimationKeys,
  MushroomFrames
} from "../utils/AssetKeys";
import { PlaceholderFactory } from "../utils/PlaceholderFactory";

const MUSHROOM_ANIMATION_FRAME_RATES = {
  idle: 1.4,
  walk: 4,
  react: 6,
  relax: 2,
  sleep: 2,
  craft: 2.5
} as const;

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload(): void {
    AnimalIslandTheme.sceneBackground(this);
    this.add.text(640, 330, "正在整理 petpet 的小屋...", {
      ...AnimalIslandTheme.textStyle(28, AnimalIslandTheme.colors.text, { fontStyle: "bold" })
    }).setOrigin(0.5);
    this.load.on("loaderror", () => undefined);
    for (const item of AssetManifest) {
      if (item.path.toLowerCase().endsWith(".svg")) {
        this.load.svg(item.key, item.path, { width: item.width, height: item.height });
      } else {
        this.load.image(item.key, item.path);
      }
    }
  }

  create(): void {
    PlaceholderFactory.ensureAll(this);
    this.createAnimations();
    this.scene.start("StartScene");
  }

  private createAnimations(): void {
    this.ensureAnimation(MushroomAnimationKeys.Idle, MushroomFrames.idle, MUSHROOM_ANIMATION_FRAME_RATES.idle, -1);
    this.ensureAnimation(MushroomAnimationKeys.Walk, MushroomFrames.walk, MUSHROOM_ANIMATION_FRAME_RATES.walk, -1);
    this.ensureAnimation(MushroomAnimationKeys.React, MushroomFrames.react, MUSHROOM_ANIMATION_FRAME_RATES.react, 0);
    this.ensureAnimation(MushroomAnimationKeys.Relax, MushroomFrames.relax, MUSHROOM_ANIMATION_FRAME_RATES.relax, -1);
    this.ensureAnimation(
      MushroomAnimationKeys.Sleep,
      [
        MushroomFrames.sleep[0],
        MushroomFrames.sleep[1],
        MushroomFrames.sleep[2],
        MushroomFrames.sleep[1],
        MushroomFrames.sleep[0],
        MushroomFrames.sleep[3],
        MushroomFrames.sleep[4],
        MushroomFrames.sleep[3],
        MushroomFrames.sleep[5],
        MushroomFrames.sleep[6]
      ],
      MUSHROOM_ANIMATION_FRAME_RATES.sleep,
      -1
    );
    this.ensureAnimation(MushroomAnimationKeys.Craft, MushroomFrames.craft, MUSHROOM_ANIMATION_FRAME_RATES.craft, -1);
    if (!this.anims.exists("baby_idle")) {
      this.anims.create({
        key: "baby_idle",
        frames: MushroomFrames.idle.map((key) => ({ key })),
        frameRate: MUSHROOM_ANIMATION_FRAME_RATES.idle,
        repeat: -1
      });
    }
    if (!this.anims.exists("baby_click_duang")) {
      this.anims.create({
        key: "baby_click_duang",
        frames: MushroomFrames.react.map((key) => ({ key })),
        frameRate: MUSHROOM_ANIMATION_FRAME_RATES.react,
        repeat: 0
      });
    }
    if (!this.anims.exists("baby_walk")) {
      this.anims.create({
        key: "baby_walk",
        frames: MushroomFrames.walk.map((key) => ({ key })),
        frameRate: MUSHROOM_ANIMATION_FRAME_RATES.walk,
        repeat: -1
      });
    }
    for (const formId of adultAnimationFormIds) {
      const walkKey = getAdultWalkAnimationKey(formId);
      if (!this.anims.exists(walkKey)) {
        this.anims.create({
          key: walkKey,
          frames: getAdultWalkFrameKeys(formId).map((key) => ({ key })),
          frameRate: formId === "ian_adult" ? 7 : 1,
          repeat: -1
        });
      }
      const clickKey = getAdultClickAnimationKey(formId);
      if (!this.anims.exists(clickKey)) {
        this.anims.create({
          key: clickKey,
          frames: getAdultClickFrameKeys(formId).map((key) => ({ key })),
          frameRate: formId === "ian_adult" ? 10 : 5,
          repeat: 0
        });
      }
    }
  }

  private ensureAnimation(key: string, frameKeys: readonly string[], frameRate: number, repeat: number): void {
    if (this.anims.exists(key)) return;
    this.anims.create({
      key,
      frames: frameKeys.map((frameKey) => ({ key: frameKey })),
      frameRate,
      repeat
    });
  }
}
