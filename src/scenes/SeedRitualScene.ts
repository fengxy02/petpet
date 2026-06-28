import Phaser from "phaser";
import { GrowthStage } from "../data/types";
import { Pot } from "../entities/Pot";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { AssetKeys } from "../utils/AssetKeys";
import { DateSystem } from "../systems/DateSystem";
import { GrowthSystem } from "../systems/GrowthSystem";
import { SaveSystem } from "../systems/SaveSystem";

export class SeedRitualScene extends Phaser.Scene {
  constructor() {
    super("SeedRitualScene");
  }

  create(): void {
    AnimalIslandTheme.sceneBackground(this);
    const save = SaveSystem.loadSave() ?? SaveSystem.createNewSave();
    const card = this.add.graphics();
    AnimalIslandTheme.drawCard(card, 420, 92, 440, 525, { fill: AnimalIslandTheme.colors.creamContent, border: AnimalIslandTheme.colors.borderLight, radius: 30, alpha: 0.9 });
    const title = this.add.text(640, 120, "这里还缺一颗种子。", {
      ...AnimalIslandTheme.textStyle(34, AnimalIslandTheme.colors.text, { fontStyle: "bold" })
    }).setOrigin(0.5);
    const pot = new Pot(this, { x: 640, y: 460, scale: 2, currentTextureKey: AssetKeys.Growth.PotEmpty }, GrowthStage.SeedInPot);
    pot.setScale(2);
    const seed = this.add.sprite(640, 255, AssetKeys.Growth.Seed).setScale(1.6);
    const button = new UIButton(this, 640, 610, "种下种子", () => {
      button.setEnabled(false);
      this.tweens.add({
        targets: seed,
        y: 400,
        scaleX: 0.4,
        scaleY: 0.4,
        alpha: 0,
        duration: 700,
        ease: "Sine.easeIn",
        onComplete: () => {
          title.setText("明天再来看看它吧。");
          pot.setStage(GrowthStage.SeedInPot);
          this.tweens.add({
            targets: pot,
            angle: { from: -4, to: 4 },
            yoyo: true,
            repeat: 3,
            duration: 90,
            onComplete: () => {
              save.seedPlanted = true;
              save.isFirstLaunch = false;
              save.openingStoryCompleted = true;
              save.dayCount = 1;
              save.lastLoginDate = DateSystem.getLocalDateString();
              save.currentDate = save.lastLoginDate;
              save.growthStage = GrowthStage.SeedInPot;
              GrowthSystem.updateSaveGrowth(save);
              SaveSystem.saveGame(save);
              pot.moveToRoomPoint(() => this.scene.start("MainRoomScene"));
            }
          });
        }
      });
    }, 250, 64, { iconKey: AssetKeys.UI.IconLeaf, iconSize: 30, variant: "primary" });
  }
}
