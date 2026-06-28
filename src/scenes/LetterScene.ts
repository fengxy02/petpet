import Phaser from "phaser";
import { LetterSystem } from "../systems/LetterSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { UIPanel } from "../ui/UIPanel";
import { TextModal } from "../ui/TextModal";
import { AssetKeys } from "../utils/AssetKeys";

export class LetterScene extends Phaser.Scene {
  private domElement?: Phaser.GameObjects.DOMElement;

  constructor() {
    super("LetterScene");
  }

  create(): void {
    const save = SaveSystem.loadSave();
    if (!save) {
      this.scene.start("StartScene");
      return;
    }
    AnimalIslandTheme.sceneBackground(this);
    this.add.image(640, 360, AssetKeys.UI.LetterEnvelope).setDisplaySize(420, 560).setAlpha(0.18);
    const isFirstLetterDay = save.dayCount === 1;
    new UIPanel(this, 640, 360, 780, 560, isFirstLetterDay ? "今天想对这颗种子说些什么？" : "今天想对它说些什么？");
    const existing = LetterSystem.getTodayLetter(save);
    if (existing) {
      this.add.text(640, 330, existing.content, {
        ...AnimalIslandTheme.textStyle(22, AnimalIslandTheme.colors.bodyText),
        wordWrap: { width: 620 },
        lineSpacing: 8,
        align: "left"
      }).setOrigin(0.5);
      this.add.text(640, 540, isFirstLetterDay ? "第一封信已经放在花盆旁边了。" : "今天已经写过信了。它会慢慢记住这些话。", {
        ...AnimalIslandTheme.textStyle(20, AnimalIslandTheme.colors.mutedText)
      }).setOrigin(0.5);
      new UIButton(this, 640, 620, "回到小屋", () => this.scene.start("MainRoomScene"), 220, 58, { variant: "primary" });
      return;
    }
    const placeholder = isFirstLetterDay ? "今天想对这颗种子说些什么？" : "写给它的一小段话...";
    this.domElement = this.add.dom(640, 360).createFromHTML(`<textarea class="letter-textarea" maxlength="500" placeholder="${placeholder}"></textarea>`);
    new UIButton(this, 520, 620, isFirstLetterDay ? "寄出第一封信" : "提交", () => this.submit(save), 200, 58, { variant: "primary" });
    new UIButton(this, 760, 620, "返回", () => this.scene.start("MainRoomScene"), 200, 58, { variant: "default" });
    if (isFirstLetterDay && !save.firstLetterGuideShown) {
      new TextModal(this, "旁白", "它现在还不会说话。\n不过，你可以先写点什么给它。\n\n也许种子会把这些话，悄悄记在心里。", "开始写信", () => {
        save.firstLetterGuideShown = true;
        SaveSystem.saveGame(save);
      });
    }
  }

  private submit(save: NonNullable<ReturnType<typeof SaveSystem.loadSave>>): void {
    const textarea = this.domElement?.node.querySelector("textarea") as HTMLTextAreaElement | null;
    const content = textarea?.value ?? "";
    try {
      LetterSystem.submitLetter(save, content);
      SaveSystem.saveGame(save);
      this.domElement?.destroy();
      const isFirstLetterDay = save.dayCount === 1;
      new TextModal(
        this,
        "信已放好",
        isFirstLetterDay ? "信已经放在花盆旁边了。\n等明天再来看看吧。" : "它把这封信收在了花盆旁边。明天再来时，也许会有一点回应。",
        "回到小屋",
        () => this.scene.start("MainRoomScene")
      );
    } catch {
      new TextModal(this, "还没有内容", "写下一点想说的话，再交给它吧。", "继续写", () => undefined);
    }
  }
}
