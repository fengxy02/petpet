import Phaser from "phaser";
import { GrowthStage } from "../data/types";
import { DateSystem } from "../systems/DateSystem";
import { GrowthSystem } from "../systems/GrowthSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { TextModal } from "../ui/TextModal";
import { AssetKeys } from "../utils/AssetKeys";

type StoryStep = {
  body: string;
  button: string;
};

const storySteps: StoryStep[] = [
  {
    body: "桌角放着一个小小的信封。\n信封上没有寄件人，只写着一句话--\n“给愿意认真照顾它的人。”",
    button: "打开信封"
  },
  {
    body:
      "你好呀。\n\n如果你看到这封信，说明这颗种子已经选中了你。\n\n它现在还很小，小到不会说话，也不会表达自己。\n但它会记住你每天的陪伴，记住你写下的话，也会慢慢学着回应你。\n\n请把它种进花盆里吧。\n也许从明天开始，你会收到一些不一样的回信。",
    button: "看看种子"
  },
  {
    body: "信封里掉出一小包种子。\n它看起来普普通通，却在掌心里轻轻发着暖暖的光。",
    button: "种进花盆"
  },
  {
    body: "种子被安稳地埋进了土里。\n现在，它需要一点时间，也需要一点你的陪伴。",
    button: "开始照顾它"
  }
];

export class OpeningStoryScene extends Phaser.Scene {
  private stepIndex = 0;
  private pot?: Phaser.GameObjects.Image;
  private seed?: Phaser.GameObjects.Image;
  private seedCard?: Phaser.GameObjects.Container;
  private dialog?: TextModal;
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
    table.fillStyle(0xd9b67a, 0.86).fillRoundedRect(295, 508, 690, 64, 22);
    table.fillStyle(0xb98a56, 0.22).fillRoundedRect(318, 564, 642, 18, 8);

    this.pot = this.add.image(650, 524, AssetKeys.Growth.OpeningPot).setOrigin(0.5, 1).setScale(0.9);
    this.drawEnvelope(505, 530);
    this.seedCard = this.drawSeedCard(790, 522).setVisible(false);
    this.seed = this.add.image(790, 440, AssetKeys.Growth.OpeningSeed).setScale(0.64).setAlpha(0);
  }

  private drawEnvelope(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(0xfffbef, 1).fillRoundedRect(-92, -50, 184, 100, 14);
    g.lineStyle(3, 0xcaa36d, 0.86).strokeRoundedRect(-92, -50, 184, 100, 14);
    g.lineStyle(3, 0xd9b67a, 0.72);
    g.lineBetween(-88, -44, 0, 12);
    g.lineBetween(88, -44, 0, 12);
    g.lineBetween(-88, 44, -8, -5);
    g.lineBetween(88, 44, 8, -5);
    const label = this.add.text(0, 18, "远方来信", AnimalIslandTheme.textStyle(18, AnimalIslandTheme.colors.text, { fontStyle: "bold" })).setOrigin(0.5);
    container.add([g, label]);
    return container;
  }

  private drawSeedCard(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    g.fillStyle(0xf7e1aa, 1).fillRoundedRect(-58, -58, 116, 116, 18);
    g.lineStyle(3, 0xb18a5f, 0.8).strokeRoundedRect(-58, -58, 116, 116, 18);
    const seed = this.add.image(0, -10, AssetKeys.Growth.OpeningSeed).setScale(0.54);
    const label = this.add.text(0, 42, "种子", AnimalIslandTheme.textStyle(16, AnimalIslandTheme.colors.text, { fontStyle: "bold" })).setOrigin(0.5);
    container.add([g, seed, label]);
    return container;
  }

  private showStep(index: number): void {
    this.stepIndex = index;
    this.dialog?.destroy();
    this.dialog = undefined;
    if (index >= storySteps.length) {
      this.finishOpening();
      return;
    }

    if (index >= 2) this.revealSeedPacket();
    const step = storySteps[index];
    this.dialog = new TextModal(this, "", step.body, step.button, () => this.handleStepAction(), {
      frameKey: AssetKeys.UI.EnvelopeDialogFrame,
      width: 760,
      height: 470,
      panelY: -118,
      shadeAlpha: 0.04,
      bodyWidth: 560,
      bodyHeight: index === 1 ? 240 : 160,
      bodyTop: index === 1 ? -278 : -228,
      bodyFontSize: index === 1 ? 18 : 24,
      buttonY: 78,
      buttonWidth: 230,
      buttonHeight: 58
    });
  }

  private handleStepAction(): void {
    if (this.stepIndex === 2 && !this.planted) {
      this.playPlantAnimation();
      return;
    }
    this.showStep(this.stepIndex + 1);
  }

  private revealSeedPacket(): void {
    if (!this.seedCard || this.seedCard.visible) return;
    this.seedCard.setVisible(true).setAlpha(0);
    this.tweens.add({ targets: this.seedCard, alpha: 1, y: this.seedCard.y - 8, duration: 350, ease: "Sine.easeOut" });
    this.tweens.add({ targets: this.seed, alpha: 1, duration: 300, ease: "Sine.easeOut" });
  }

  private playPlantAnimation(): void {
    this.planted = true;
    this.dialog?.destroy();
    this.dialog = undefined;
    this.seedCard?.setAlpha(0.45);
    if (!this.seed || !this.pot) return;
    this.tweens.add({
      targets: this.seed,
      x: this.pot.x,
      y: this.pot.y - 62,
      scaleX: 0.24,
      scaleY: 0.24,
      alpha: 0,
      duration: 850,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.playPotGlow();
        this.time.delayedCall(650, () => this.showStep(3));
      }
    });
  }

  private playPotGlow(): void {
    if (!this.pot) return;
    const glow = this.add.graphics().setDepth(this.pot.depth + 1);
    glow.fillStyle(0xffdf86, 0.55).fillEllipse(this.pot.x, this.pot.y - 58, 160, 58);
    this.tweens.add({ targets: glow, alpha: 0, scaleX: 1.8, scaleY: 1.55, duration: 800, ease: "Sine.easeOut", onComplete: () => glow.destroy() });
    for (let i = 0; i < 12; i += 1) {
      const sparkle = this.add.circle(this.pot.x + Phaser.Math.Between(-46, 46), this.pot.y - Phaser.Math.Between(64, 122), Phaser.Math.Between(2, 4), 0xffe6a3, 0.82);
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
}
