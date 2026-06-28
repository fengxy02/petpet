import Phaser from "phaser";
import { furnitureLabels } from "../data/furnitureDatabase";
import { SaveSystem } from "../systems/SaveSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { UIPanel } from "../ui/UIPanel";
import { AssetKeys } from "../utils/AssetKeys";

export class RecordBoardScene extends Phaser.Scene {
  constructor() {
    super("RecordBoardScene");
  }

  create(): void {
    const save = SaveSystem.loadSave();
    if (!save) {
      this.scene.start("StartScene");
      return;
    }

    AnimalIslandTheme.sceneBackground(this);
    new UIPanel(this, 640, 360, 980, 600, "记录板");
    this.add.image(250, 132, AssetKeys.UI.IconRecord).setDisplaySize(70, 70).setAlpha(0.95);

    const latestLetters = save.letters.slice(-3).reverse();
    const latestSummaries = save.summaries.slice(-3).reverse();
    const latestInteractions = save.interactionRecords
      .filter((record) => record.action !== "DailyEventChecked")
      .slice(-5)
      .reverse();

    this.addSectionTitle(260, 190, "最近的信");
    if (latestLetters.length === 0) {
      this.addLine(260, 232, "还没有写信记录。");
    } else {
      latestLetters.forEach((letter, index) => {
        this.addLine(260, 232 + index * 42, `Day ${letter.day}：${this.truncate(letter.content, 24)}`);
      });
    }

    this.addSectionTitle(260, 372, "小结");
    if (latestSummaries.length === 0) {
      this.addLine(260, 414, "还没有小结。");
    } else {
      latestSummaries.forEach((summary, index) => {
        this.addLine(260, 414 + index * 42, `Day ${summary.sourceDay}：${this.truncate(summary.summaryText, 24)}`);
      });
    }

    this.addSectionTitle(700, 190, "最近互动");
    if (latestInteractions.length === 0) {
      this.addLine(700, 232, "还没有互动记录。");
    } else {
      latestInteractions.forEach((record, index) => {
        const label = furnitureLabels[record.furnitureType] ?? "小屋";
        this.addLine(700, 232 + index * 42, `Day ${record.day}：${label}`);
      });
    }

    new UIButton(this, 640, 635, "回到小屋", () => this.scene.start("MainRoomScene"), 220, 58, {
      iconKey: AssetKeys.UI.IconHome,
      iconSize: 28,
      variant: "primary"
    });
  }

  private addSectionTitle(x: number, y: number, text: string): void {
    this.add.text(x, y, text, AnimalIslandTheme.textStyle(25, AnimalIslandTheme.colors.text, { fontStyle: "bold" })).setOrigin(0, 0.5);
  }

  private addLine(x: number, y: number, text: string): void {
    this.add.text(x, y, text, {
      ...AnimalIslandTheme.textStyle(18, AnimalIslandTheme.colors.bodyText),
      wordWrap: { width: 360 }
    }).setOrigin(0, 0.5);
  }

  private truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  }
}
