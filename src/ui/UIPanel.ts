import Phaser from "phaser";
import { AnimalIslandTheme } from "./AnimalIslandTheme";

export class UIPanel extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, title?: string) {
    super(scene, x, y);
    const bg = scene.add.graphics();
    AnimalIslandTheme.drawPanel(bg, width, height);
    this.add(bg);
    if (title) {
      const titleBg = scene.add.graphics();
      AnimalIslandTheme.drawTitlePill(titleBg, Math.min(width - 96, Math.max(260, title.length * 30)), 54);
      titleBg.setY(-height / 2 + 38);
      this.add(scene.add.text(0, -height / 2 + 34, title, {
        ...AnimalIslandTheme.textStyle(28, AnimalIslandTheme.colors.creamSoft, {
          fontStyle: "bold"
        })
      }).setOrigin(0.5));
      this.addAt(titleBg, 1);
    }
    scene.add.existing(this);
  }
}
