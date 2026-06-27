import Phaser from "phaser";
import { GrowthStage } from "../data/types";
import { AdultFormGenerator } from "../systems/AdultFormGenerator";
import { SaveSystem } from "../systems/SaveSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { UIPanel } from "../ui/UIPanel";
import { getAdultIdleKey } from "../utils/AssetKeys";

export class AdultFormScene extends Phaser.Scene {
  constructor() {
    super("AdultFormScene");
  }

  create(): void {
    const save = SaveSystem.loadSave();
    if (!save) {
      this.scene.start("StartScene");
      return;
    }
    save.adultForm = AdultFormGenerator.generate(save);
    this.render(save);
  }

  private render(save: NonNullable<ReturnType<typeof SaveSystem.loadSave>>): void {
    this.children.removeAll(true);
    AnimalIslandTheme.sceneBackground(this);
    new UIPanel(this, 640, 360, 880, 600, "它长成了新的样子");

    const portrait = this.add.graphics();
    AnimalIslandTheme.drawCard(portrait, 250, 225, 230, 295, {
      fill: AnimalIslandTheme.colors.creamSoft,
      border: AnimalIslandTheme.colors.borderLight,
      radius: 26,
      alpha: 0.78
    });
    this.add.sprite(360, 485, getAdultIdleKey(save.adultForm?.formId)).setOrigin(0.5, 1).setScale(1.05);

    this.add.text(690, 220, save.adultForm?.formName ?? "Ian 成年体", {
      ...AnimalIslandTheme.textStyle(34, AnimalIslandTheme.colors.text),
      fontStyle: "bold"
    }).setOrigin(0.5);
    this.add.text(690, 300, save.adultForm?.description ?? "", {
      ...AnimalIslandTheme.textStyle(23, AnimalIslandTheme.colors.bodyText),
      wordWrap: { width: 420 },
      align: "center",
      lineSpacing: 8
    }).setOrigin(0.5);
    this.add.text(690, 405, save.adultForm?.reason ?? "", {
      ...AnimalIslandTheme.textStyle(20, AnimalIslandTheme.colors.mutedText),
      wordWrap: { width: 450 },
      align: "center",
      lineSpacing: 6
    }).setOrigin(0.5);
    new UIButton(this, 690, 580, "接受这个样子", () => this.accept(save), 240, 58, { variant: "primary" });
  }

  private accept(save: NonNullable<ReturnType<typeof SaveSystem.loadSave>>): void {
    save.growthStage = GrowthStage.AdultPet;
    save.adultFormGenerated = true;
    save.adultFormLocked = true;
    save.pet.adultFormId = save.adultForm?.formId;
    SaveSystem.saveGame(save);
    this.scene.start("MainRoomScene");
  }
}
