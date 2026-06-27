import Phaser from "phaser";
import { LetterSystem } from "../systems/LetterSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { UIPanel } from "../ui/UIPanel";
import { TextModal } from "../ui/TextModal";

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
    new UIPanel(this, 640, 360, 780, 560, "今天想对它说些什么？");
    const existing = LetterSystem.getTodayLetter(save);
    if (existing) {
      this.add.text(640, 330, existing.content, {
        ...AnimalIslandTheme.textStyle(22, AnimalIslandTheme.colors.bodyText),
        wordWrap: { width: 620 },
        lineSpacing: 8,
        align: "left"
      }).setOrigin(0.5);
      this.add.text(640, 540, "今天已经写过信了。它会慢慢记住这些话。", {
        ...AnimalIslandTheme.textStyle(20, AnimalIslandTheme.colors.mutedText)
      }).setOrigin(0.5);
      new UIButton(this, 640, 620, "回到小屋", () => this.scene.start("MainRoomScene"), 220, 58, { variant: "primary" });
      return;
    }
    this.domElement = this.add.dom(640, 360).createFromHTML('<textarea class="letter-textarea" maxlength="500" placeholder="写给它的一小段话..."></textarea>');
    new UIButton(this, 520, 620, "提交", () => this.submit(save), 200, 58, { variant: "primary" });
    new UIButton(this, 760, 620, "返回", () => this.scene.start("MainRoomScene"), 200, 58, { variant: "default" });
  }

  private submit(save: NonNullable<ReturnType<typeof SaveSystem.loadSave>>): void {
    const textarea = this.domElement?.node.querySelector("textarea") as HTMLTextAreaElement | null;
    const content = textarea?.value ?? "";
    try {
      LetterSystem.submitLetter(save, content);
      SaveSystem.saveGame(save);
      this.domElement?.destroy();
      new TextModal(this, "信已放好", "它把这封信收在了花盆旁边。明天再来时，也许会有一点回应。", "回到小屋", () => this.scene.start("MainRoomScene"));
    } catch {
      new TextModal(this, "还没有内容", "写下一点想说的话，再交给它吧。", "继续写", () => undefined);
    }
  }
}
