import Phaser from "phaser";

export class LetterModal extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 640, 360);
    scene.add.existing(this);
  }
}
