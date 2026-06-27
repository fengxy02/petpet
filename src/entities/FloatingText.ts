import Phaser from "phaser";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";

export class FloatingText {
  static show(scene: Phaser.Scene, x: number, y: number, text: string): void {
    const label = scene.add.text(x, y, text, {
      ...AnimalIslandTheme.textStyle(20, AnimalIslandTheme.colors.text, { fontStyle: "bold" }),
      backgroundColor: AnimalIslandTheme.hex(AnimalIslandTheme.colors.creamSoft),
      padding: { x: 12, y: 8 }
    }).setOrigin(0.5).setDepth(20000);
    scene.tweens.add({
      targets: label,
      y: y - 38,
      alpha: 0,
      duration: 1500,
      ease: "Sine.easeOut",
      onComplete: () => label.destroy()
    });
  }
}
