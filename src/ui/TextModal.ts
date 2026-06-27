import Phaser from "phaser";
import { AnimalIslandTheme } from "./AnimalIslandTheme";
import { UIButton } from "./UIButton";
import { UIPanel } from "./UIPanel";

export class TextModal extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, title: string, body: string, buttonText: string, onClose: () => void) {
    super(scene, 640, 360);
    this.setDepth(10000);
    const shade = scene.add.rectangle(0, 0, 1280, 720, AnimalIslandTheme.colors.shadow, 0.26);
    const panel = new UIPanel(scene, 0, 0, 620, 360, title);
    const text = scene.add.text(0, -25, body, {
      ...AnimalIslandTheme.textStyle(22, AnimalIslandTheme.colors.bodyText),
      align: "center",
      wordWrap: { width: 500 },
      lineSpacing: 8
    }).setOrigin(0.5);
    const button = new UIButton(scene, 0, 125, buttonText, () => {
      this.destroy();
      onClose();
    }, 210, 58, { variant: "primary" });
    this.add([shade, panel, text, button]);
    scene.add.existing(this);
  }
}
