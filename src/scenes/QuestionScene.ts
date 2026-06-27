import Phaser from "phaser";
import { GameFlowSystem } from "../systems/GameFlowSystem";
import { PreferenceSystem } from "../systems/PreferenceSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { UIPanel } from "../ui/UIPanel";

export class QuestionScene extends Phaser.Scene {
  constructor() {
    super("QuestionScene");
  }

  create(): void {
    const save = SaveSystem.loadSave();
    if (!save) {
      this.scene.start("StartScene");
      return;
    }
    const question = PreferenceSystem.getNextQuestion(save);
    if (!question) {
      this.scene.start(GameFlowSystem.getAfterSummaryScene(save));
      return;
    }
    AnimalIslandTheme.sceneBackground(this);
    new UIPanel(this, 640, 360, 800, 520, "它好像有个小问题");
    this.add.text(640, 235, question.text, {
      ...AnimalIslandTheme.textStyle(27, AnimalIslandTheme.colors.bodyText, { fontStyle: "bold" }),
      wordWrap: { width: 650 },
      align: "center"
    }).setOrigin(0.5);
    question.options.forEach((option, index) => {
      const y = 320 + index * 62;
      new UIButton(this, 640, y, option.label, () => {
        PreferenceSystem.applyAnswer(save, question, option);
        SaveSystem.saveGame(save);
        this.scene.start("MainRoomScene");
      }, 360, 52, { variant: index === 0 ? "primary" : "default", fontSize: 18 });
    });
  }
}
