import Phaser from "phaser";
import { GrowthStage } from "../data/types";
import { DateSystem } from "../systems/DateSystem";
import { GrowthSystem } from "../systems/GrowthSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { AssetKeys } from "../utils/AssetKeys";

type StoryStep = {
  title: string;
  body: string;
  button: string;
};

const storySteps: StoryStep[] = [
  {
    title: "旁白",
    body: "桌角放着一个小小的信封。\n信封上没有寄件人，只写着一句话——\n“给愿意认真照顾它的人。”",
    button: "打开信封"
  },
  {
    title: "神秘来信",
    body:
      "你好呀。\n\n如果你看到这封信，说明这颗种子已经选中了你。\n\n它现在还很小，小到不会说话，也不会表达自己。\n但它会记住你每天的陪伴，记住你写下的话，也会慢慢学着回应你。\n\n请把它种进花盆里吧。\n也许从明天开始，你会收到一些不一样的回信。",
    button: "看看种子"
  },
  {
    title: "旁白",
    body: "信封里掉出一小包种子。\n它看起来普普通通，却在掌心里轻轻发着暖暖的光。",
    button: "种进花盆"
  },
  {
    title: "旁白",
    body: "种子被安稳地埋进了土里。\n现在，它需要一点时间，也需要一点你的陪伴。",
    button: "开始照顾它"
  }
];

export class OpeningStoryScene extends Phaser.Scene {
  private stepIndex = 0;
  private pot?: Phaser.GameObjects.Image;
  private seed?: Phaser.GameObjects.Image;
  private seedPacket?: Phaser.GameObjects.Container;
  private dialogObjects: Phaser.GameObjects.GameObject[] = [];
  private planted = false;

  constructor() {
    super("OpeningStoryScene");
  }

  create(): void {
    const save = SaveSystem.loadSave() ?? SaveSystem.createNewSave();
    if (!save.isFirstLaunch || save.openingStoryCompleted) {
      this.scene.start("MainRoomScene");
      return;
    }

    this.drawScene();
    this.cameras.main.fadeIn(650, 248, 239, 224);
    this.showStep(0);
  }

  private drawScene(): void {
    this.add.image(640, 360, AssetKeys.Room.PetpetBackground).setDisplaySize(1280, 720);
    const glow = this.add.graphics();
    glow.fillStyle(0xfff3c2, 0.22).fillEllipse(525, 205, 620, 250);
    glow.fillStyle(0xfffbef, 0.16).fillEllipse(615, 355, 850, 360);

    const table = this.add.graphics();
    table.fillStyle(0xd9b67a, 0.86).fillRoundedRect(295, 492, 690, 64, 22);
    table.fillStyle(0xb98a56, 0.22).fillRoundedRect(318, 548, 642, 18, 8);

    this.pot = this.add.image(650, 505, AssetKeys.Growth.PotEmpty).setOrigin(0.5, 1).setScale(2.35);
    this.drawEnvelope(510, 508);
    this.seedPacket = this.drawSeedPacket(785, 505).setVisible(false);
    this.seed = this.add.image(780, 435, AssetKeys.Growth.Seed).setScale(1.35).setAlpha(0);
  }

  private drawEnvelope(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(0xfffbef, 1).fillRoundedRect(-82, -45, 164, 90, 12);
    g.lineStyle(3, 0xcaa36d, 0.86).strokeRoundedRect(-82, -45, 164, 90, 12);
    g.lineStyle(3, 0xd9b67a, 0.72);
    g.lineBetween(-78, -39, 0, 10);
    g.lineBetween(78, -39, 0, 10);
    g.lineBetween(-78, 39, -8, -5);
    g.lineBetween(78, 39, 8, -5);
    const label = this.add.text(0, 14, "远方来信", AnimalIslandTheme.textStyle(18, AnimalIslandTheme.colors.text, { fontStyle: "bold" })).setOrigin(0.5);
    container.add([g, label]);
    return container;
  }

  private drawSeedPacket(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(0xf7e1aa, 1).fillRoundedRect(-54, -54, 108, 108, 18);
    g.lineStyle(3, 0xb18a5f, 0.8).strokeRoundedRect(-54, -54, 108, 108, 18);
    g.fillStyle(0xfffbef, 0.9).fillRoundedRect(-34, -28, 68, 48, 12);
    g.fillStyle(0x80bd7c, 1).fillEllipse(-12, -3, 24, 34);
    g.fillStyle(0xc7e8aa, 1).fillEllipse(14, -7, 22, 30);
    const label = this.add.text(0, 38, "种子", AnimalIslandTheme.textStyle(16, AnimalIslandTheme.colors.text, { fontStyle: "bold" })).setOrigin(0.5);
    container.add([g, label]);
    return container;
  }

  private showStep(index: number): void {
    this.stepIndex = index;
    this.clearDialog();
    if (index >= storySteps.length) {
      this.finishOpening();
      return;
    }

    const step = storySteps[index];
    if (index >= 2) this.revealSeedPacket();
    const panel = this.add.graphics();
    AnimalIslandTheme.drawCard(panel, 305, 86, 670, 282, {
      fill: AnimalIslandTheme.colors.creamContent,
      border: AnimalIslandTheme.colors.borderLight,
      radius: 28,
      alpha: 0.94
    });
    const title = this.add.text(640, 124, step.title, AnimalIslandTheme.textStyle(28, AnimalIslandTheme.colors.text, { fontStyle: "bold" })).setOrigin(0.5);
    const body = this.add
      .text(640, index === 1 ? 226 : 218, step.body, {
        ...AnimalIslandTheme.textStyle(index === 1 ? 18 : 23, AnimalIslandTheme.colors.bodyText),
        align: "center",
        wordWrap: { width: 570 },
        lineSpacing: index === 1 ? 5 : 9
      })
      .setOrigin(0.5);
    const button = new UIButton(this, 640, 420, step.button, () => this.handleStepAction(), 230, 58, { variant: "primary", fontSize: 20 });
    this.dialogObjects.push(panel, title, body, button);
  }

  private handleStepAction(): void {
    if (this.stepIndex === 2 && !this.planted) {
      this.playPlantAnimation();
      return;
    }
    this.showStep(this.stepIndex + 1);
  }

  private revealSeedPacket(): void {
    if (!this.seedPacket || this.seedPacket.visible) return;
    this.seedPacket.setVisible(true).setAlpha(0);
    this.tweens.add({ targets: this.seedPacket, alpha: 1, y: this.seedPacket.y - 8, duration: 350, ease: "Sine.easeOut" });
    this.tweens.add({ targets: this.seed, alpha: 1, duration: 300, ease: "Sine.easeOut" });
  }

  private playPlantAnimation(): void {
    this.planted = true;
    this.clearDialog();
    this.seedPacket?.setAlpha(0.45);
    if (!this.seed || !this.pot) return;
    this.tweens.add({
      targets: this.seed,
      x: this.pot.x,
      y: this.pot.y - 75,
      scaleX: 0.42,
      scaleY: 0.42,
      alpha: 0,
      duration: 850,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.pot?.setTexture(AssetKeys.Growth.PotSoil);
        this.playPotGlow();
        this.time.delayedCall(650, () => this.showStep(3));
      }
    });
  }

  private playPotGlow(): void {
    if (!this.pot) return;
    const glow = this.add.graphics().setDepth(this.pot.depth + 1);
    glow.fillStyle(0xffdf86, 0.55).fillEllipse(this.pot.x, this.pot.y - 58, 140, 54);
    this.tweens.add({ targets: glow, alpha: 0, scaleX: 1.8, scaleY: 1.55, duration: 800, ease: "Sine.easeOut", onComplete: () => glow.destroy() });
    for (let i = 0; i < 12; i += 1) {
      const sparkle = this.add.circle(this.pot.x + Phaser.Math.Between(-42, 42), this.pot.y - Phaser.Math.Between(64, 122), Phaser.Math.Between(2, 4), 0xffe6a3, 0.82);
      this.tweens.add({
        targets: sparkle,
        y: sparkle.y - Phaser.Math.Between(20, 46),
        alpha: 0,
        duration: Phaser.Math.Between(520, 900),
        ease: "Sine.easeOut",
        onComplete: () => sparkle.destroy()
      });
    }
  }

  private finishOpening(): void {
    const save = SaveSystem.loadSave() ?? SaveSystem.createNewSave();
    const today = DateSystem.getLocalDateString();
    save.isFirstLaunch = false;
    save.openingStoryCompleted = true;
    save.seedPlanted = true;
    save.dayCount = 1;
    save.lastLoginDate = today;
    save.currentDate = today;
    save.growthStage = GrowthStage.SeedInPot;
    GrowthSystem.updateSaveGrowth(save);
    SaveSystem.saveGame(save);
    this.scene.start("MainRoomScene");
  }

  private clearDialog(): void {
    for (const object of this.dialogObjects) object.destroy();
    this.dialogObjects = [];
  }
}
