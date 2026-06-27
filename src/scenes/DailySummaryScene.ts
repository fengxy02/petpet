import Phaser from "phaser";
import { GameFlowSystem } from "../systems/GameFlowSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { SummarySystem } from "../systems/SummarySystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { UIPanel } from "../ui/UIPanel";

export class DailySummaryScene extends Phaser.Scene {
  constructor() {
    super("DailySummaryScene");
  }

  create(): void {
    AnimalIslandTheme.sceneBackground(this);
    this.add.text(640, 360, "它正在回想你昨天写下的话...", {
      ...AnimalIslandTheme.textStyle(28, AnimalIslandTheme.colors.text, { fontStyle: "bold" })
    }).setOrigin(0.5);
    void this.showSummary();
  }

  private async showSummary(): Promise<void> {
    const save = SaveSystem.loadSave();
    if (!save) {
      this.scene.start("StartScene");
      return;
    }
    const summary = await SummarySystem.createSummary(save);
    this.children.removeAll(true);
    AnimalIslandTheme.sceneBackground(this);
    new UIPanel(this, 640, 360, 760, 430, "昨日小结");
    const text = summary?.summaryText ?? "今天它安静地看了看花盆，像是在慢慢学习如何回应你。";
    this.add.text(640, 340, text, {
      ...AnimalIslandTheme.textStyle(24, AnimalIslandTheme.colors.bodyText),
      wordWrap: { width: 610 },
      align: "center",
      lineSpacing: 10
    }).setOrigin(0.5);
    new UIButton(this, 640, 525, "继续", () => {
      if (summary) SummarySystem.markRead(save, summary.sourceDay);
      SaveSystem.saveGame(save);
      this.scene.start(GameFlowSystem.getAfterSummaryScene(save));
    }, 220, 58, { variant: "primary" });
  }
}
