import Phaser from "phaser";
import { AnimalIslandTheme } from "./AnimalIslandTheme";

export class StatusBar extends Phaser.GameObjects.Container {
  private fill: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private widthValue: number;

  constructor(scene: Phaser.Scene, x: number, y: number, label: string, value: number, color: number) {
    super(scene, x, y);
    this.widthValue = 160;
    const bg = scene.add.graphics();
    bg.fillStyle(AnimalIslandTheme.colors.creamSoft, 1).fillRoundedRect(0, -12, this.widthValue, 24, 12);
    bg.lineStyle(2, AnimalIslandTheme.colors.borderLight, 1).strokeRoundedRect(1, -11, this.widthValue - 2, 22, 11);
    this.fill = scene.add.rectangle(5, 0, 1, 15, color).setOrigin(0, 0.5);
    this.label = scene.add.text(-10, 0, label, AnimalIslandTheme.textStyle(16, AnimalIslandTheme.colors.text, { fontStyle: "bold" })).setOrigin(1, 0.5);
    this.add([bg, this.fill, this.label]);
    this.setValue(value);
    scene.add.existing(this);
  }

  setValue(value: number): void {
    this.fill.width = Math.max(0, Math.min(1, value / 100)) * (this.widthValue - 8);
  }
}
