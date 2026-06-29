import Phaser from "phaser";
import { GrowthStage } from "../data/types";
import { AdultFormGenerator } from "../systems/AdultFormGenerator";
import { SaveSystem } from "../systems/SaveSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { UIPanel } from "../ui/UIPanel";
import { getAdultIdleAnimationKey, getAdultIdleKey } from "../utils/AssetKeys";

type Save = NonNullable<ReturnType<typeof SaveSystem.loadSave>>;

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

  private render(save: Save): void {
    this.children.removeAll(true);
    AnimalIslandTheme.sceneBackground(this);
    new UIPanel(this, 640, 360, 980, 610, "它长成了新的样子");

    const portrait = this.add.graphics();
    AnimalIslandTheme.drawCard(portrait, 210, 175, 310, 360, {
      fill: AnimalIslandTheme.colors.creamSoft,
      border: AnimalIslandTheme.colors.borderLight,
      radius: 26,
      alpha: 0.78
    });
    const sprite = this.add.sprite(365, 500, getAdultIdleKey(save.adultForm?.formId)).setOrigin(0.5, 1).setScale(1.08);
    sprite.play(getAdultIdleAnimationKey(save.adultForm?.formId), true);

    const title = save.adultForm?.formName ?? "Ian 成年体";
    this.add.text(720, 165, title, {
      ...AnimalIslandTheme.textStyle(34, AnimalIslandTheme.colors.text),
      fontStyle: "bold"
    }).setOrigin(0.5);

    const body = `${save.adultForm?.description ?? ""}\n\n${save.adultForm?.reason ?? ""}`;
    this.addScrollableText(720, 225, 455, 235, body);
    new UIButton(this, 720, 580, "接受这个样子", () => this.accept(save), 240, 58, { variant: "primary" });
  }

  private addScrollableText(x: number, y: number, width: number, height: number, body: string): void {
    const text = this.add
      .text(x, y, body, {
        ...AnimalIslandTheme.textStyle(22, AnimalIslandTheme.colors.bodyText),
        wordWrap: { width },
        align: "center",
        lineSpacing: 8
      })
      .setOrigin(0.5, 0);

    const maskShape = this.add.graphics().setAlpha(0);
    maskShape.fillStyle(0xffffff, 1).fillRect(x - width / 2, y, width, height);
    const mask = maskShape.createGeometryMask();
    text.setMask(mask);

    const maxScroll = Math.max(0, text.height - height);
    let scrollY = 0;
    const scrollbar = this.add.graphics();
    const drawScrollbar = (): void => {
      scrollbar.clear();
      if (maxScroll <= 0) return;
      const thumbHeight = Math.max(34, (height / text.height) * height);
      const thumbY = y + (scrollY / maxScroll) * (height - thumbHeight);
      scrollbar.fillStyle(AnimalIslandTheme.colors.borderLight, 0.45).fillRoundedRect(x + width / 2 + 18, y, 5, height, 3);
      scrollbar.fillStyle(AnimalIslandTheme.colors.teal, 0.78).fillRoundedRect(x + width / 2 + 17, thumbY, 7, thumbHeight, 4);
    };
    const wheelHandler = (_pointer: Phaser.Input.Pointer, _objects: Phaser.GameObjects.GameObject[], _deltaX: number, deltaY: number): void => {
      if (maxScroll <= 0) return;
      scrollY = Phaser.Math.Clamp(scrollY + deltaY * 0.35, 0, maxScroll);
      text.setY(y - scrollY);
      drawScrollbar();
    };
    this.input.on("wheel", wheelHandler);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off("wheel", wheelHandler);
      mask.destroy();
      maskShape.destroy();
    });
    drawScrollbar();
  }

  private accept(save: Save): void {
    save.growthStage = GrowthStage.AdultPet;
    save.adultFormGenerated = true;
    save.adultFormLocked = true;
    save.pet.adultFormId = save.adultForm?.formId;
    SaveSystem.saveGame(save);
    this.scene.start("MainRoomScene");
  }
}
