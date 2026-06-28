import Phaser from "phaser";
import { DateSystem } from "../systems/DateSystem";
import { GameFlowSystem } from "../systems/GameFlowSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { AssetKeys } from "../utils/AssetKeys";

const START_BUTTON_X = 340;
const START_BUTTON_Y = 470;
const SETTINGS_BUTTON_Y = 580;
const HOME_BUTTON_WIDTH = 360;
const TITLE_X = 350;
const TITLE_Y = 175;
const TITLE_WIDTH = 520;
const HERO_X = 925;
const HERO_Y = 665;
const HERO_HEIGHT = 530;
const CLICK_DELAY_MS = 100;

export class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create(): void {
    this.add.image(640, 360, AssetKeys.Start.HomeBackground).setDisplaySize(1280, 720);
    this.createStartHero();
    this.createWobblingLogo();
    this.createHomeImageButton(START_BUTTON_X, START_BUTTON_Y, AssetKeys.Start.StartButton, () => this.startGame());
    this.createHomeImageButton(START_BUTTON_X, SETTINGS_BUTTON_Y, AssetKeys.Start.SettingsButton, () => this.scene.start("SettingsScene", { returnScene: "StartScene" }));
  }

  private startGame(): void {
    const save = SaveSystem.loadSave();
    if (save) {
      DateSystem.applyLoginProgress(save);
      SaveSystem.saveGame(save);
      this.scene.start(GameFlowSystem.getEntryScene(save));
      return;
    }

    SaveSystem.createNewSave();
    this.scene.start("SeedRitualScene");
  }

  private createWobblingLogo(): void {
    const logo = this.add.image(TITLE_X, TITLE_Y, AssetKeys.Start.HomeTitle).setOrigin(0.5);
    logo.setDisplaySize(TITLE_WIDTH, TITLE_WIDTH * (logo.height / logo.width));
    this.tweens.add({
      targets: logo,
      x: TITLE_X + 10,
      angle: 2,
      duration: 1200,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  }

  private createStartHero(): void {
    const shadow = this.add.ellipse(HERO_X, HERO_Y - 10, 220, 32, 0x5d4b3c, 0.14).setOrigin(0.5);
    const hero = this.add.image(HERO_X, HERO_Y, AssetKeys.Start.StartHero).setOrigin(0.5, 1);
    hero.setDisplaySize(HERO_HEIGHT * (hero.width / hero.height), HERO_HEIGHT);
    this.tweens.add({
      targets: hero,
      y: HERO_Y - 8,
      angle: 1.5,
      duration: 1500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
    this.tweens.add({
      targets: shadow,
      scaleX: 0.94,
      alpha: 0.1,
      duration: 1500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });
  }

  private createHomeImageButton(x: number, y: number, textureKey: string, onClick: () => void): Phaser.GameObjects.Image {
    const button = this.add.image(x, y, textureKey).setOrigin(0.5);
    button.setDisplaySize(HOME_BUTTON_WIDTH, HOME_BUTTON_WIDTH * (button.height / button.width));
    button.setInteractive({
      useHandCursor: true,
      pixelPerfect: true,
      alphaTolerance: 16
    });
    this.addJellyInteraction(button, onClick);
    return button;
  }

  private addJellyInteraction(target: Phaser.GameObjects.Image, onClick: () => void): void {
    const baseScaleX = target.scaleX;
    const baseScaleY = target.scaleY;
    let pressed = false;

    const returnToBase = (): void => {
      this.tweens.killTweensOf(target);
      this.tweens.add({
        targets: target,
        scaleX: baseScaleX,
        scaleY: baseScaleY,
        duration: 140,
        ease: "Back.Out"
      });
    };

    const playReleaseJelly = (): void => {
      this.tweens.killTweensOf(target);
      this.tweens.add({
        targets: target,
        scaleX: baseScaleX * 1.06,
        scaleY: baseScaleY * 0.94,
        duration: 70,
        ease: "Sine.easeOut",
        onComplete: () => {
          this.tweens.add({
            targets: target,
            scaleX: baseScaleX,
            scaleY: baseScaleY,
            duration: 150,
            ease: "Back.Out"
          });
        }
      });
    };

    target.on("pointerdown", () => {
      pressed = true;
      this.tweens.killTweensOf(target);
      target.setScale(baseScaleX * 1.08, baseScaleY * 0.88);
      this.tweens.add({
        targets: target,
        scaleX: baseScaleX * 0.96,
        scaleY: baseScaleY * 1.05,
        duration: 90,
        ease: "Sine.easeOut"
      });
    });

    target.on("pointerup", () => {
      if (!pressed) return;
      pressed = false;
      playReleaseJelly();
      this.time.delayedCall(CLICK_DELAY_MS, onClick);
    });

    target.on("pointerout", () => {
      if (!pressed) return;
      pressed = false;
      returnToBase();
    });
  }
}
