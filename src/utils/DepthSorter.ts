import Phaser from "phaser";

export class DepthSorter {
  static applyByY(object: Phaser.GameObjects.GameObject & { y: number; setDepth: (value: number) => unknown }, offset = 0): void {
    object.setDepth(Math.floor(object.y + offset));
  }

  static sort(objects: Array<Phaser.GameObjects.GameObject & { y: number; setDepth: (value: number) => unknown }>): void {
    for (const object of objects) {
      this.applyByY(object);
    }
  }
}
