import Phaser from "phaser";
import { AnimalIslandTheme } from "./AnimalIslandTheme";
import { UIButton } from "./UIButton";
import { UIPanel } from "./UIPanel";

export class ChoiceModal extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, title: string, body: string, choices: Array<{ label: string; onClick: () => void }>) {
    super(scene, 640, 360);
    this.setDepth(10000);
    const shade = scene.add.rectangle(0, 0, 1280, 720, AnimalIslandTheme.colors.shadow, 0.26);
    const height = Math.max(360, 220 + choices.length * 66);
    const panel = new UIPanel(scene, 0, 0, 680, height, title);
    const text = scene.add.text(0, -height / 2 + 100, body, {
      ...AnimalIslandTheme.textStyle(22, AnimalIslandTheme.colors.bodyText),
      align: "center",
      wordWrap: { width: 560 },
      lineSpacing: 8
    }).setOrigin(0.5);
    this.add([shade, panel, text]);
    choices.forEach((choice, index) => {
      const button = new UIButton(scene, 0, -height / 2 + 170 + index * 66, choice.label, () => {
        this.destroy();
        choice.onClick();
      }, 390, 54, { variant: index === 0 ? "primary" : "default" });
      this.add(button);
    });
    scene.add.existing(this);
  }
}
