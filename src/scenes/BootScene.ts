import Phaser from "phaser";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    AnimalIslandTheme.sceneBackground(this);
    this.scene.start("PreloadScene");
  }
}
