import Phaser from "phaser";
import { furnitureLabels } from "../data/furnitureDatabase";
import { FloorId, FurnitureSaveData, FurnitureType } from "../data/types";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { getFurnitureTextureKey } from "../utils/AssetKeys";
import { DepthSorter } from "../utils/DepthSorter";

export class Furniture extends Phaser.GameObjects.Container {
  readonly item: FurnitureSaveData;
  readonly interactionPoint: Phaser.Math.Vector2;
  private sprite: Phaser.GameObjects.Sprite;
  private label?: Phaser.GameObjects.Text;
  private wallMounted: boolean;

  constructor(scene: Phaser.Scene, item: FurnitureSaveData) {
    super(scene, item.x, item.y);
    this.item = item;
    this.wallMounted = this.isWallMounted(item);
    this.sprite = scene.add
      .sprite(0, 0, getFurnitureTextureKey(item.type, item.rotation))
      .setOrigin(0.5, this.wallMounted ? 0.5 : 1)
      .setScale(item.scale)
      .setRotation(this.getSpriteRotation());
    this.add(this.sprite);
    if (item.interactable) {
      this.label = scene.add.text(0, this.wallMounted ? 54 : 14, furnitureLabels[item.type], {
        ...AnimalIslandTheme.textStyle(15, AnimalIslandTheme.colors.text, { fontStyle: "bold" }),
        backgroundColor: AnimalIslandTheme.hex(AnimalIslandTheme.colors.creamSoft),
        padding: { x: 6, y: 3 }
      }).setOrigin(0.5, 0);
      this.label.setAlpha(0);
      this.add(this.label);
    }
    this.interactionPoint = new Phaser.Math.Vector2(item.x, item.y).add(this.interactionOffset(item.type, this.wallMounted));
    this.setSize(this.wallMounted ? 150 : 120, this.wallMounted ? 120 : 100);
    if (item.interactable) {
      this.setInteractive({ useHandCursor: true });
      this.on("pointerover", () => this.label?.setAlpha(1));
      this.on("pointerout", () => this.label?.setAlpha(0));
    }
    if (this.wallMounted) {
      this.setDepth(-68);
    } else {
      DepthSorter.applyByY(this);
    }
    scene.add.existing(this);
  }

  get floorId(): FloorId {
    return this.item.floorId;
  }

  get furnitureType(): FurnitureType {
    return this.item.type;
  }

  syncFromItem(): void {
    this.wallMounted = this.isWallMounted(this.item);
    this.setPosition(this.item.x, this.item.y);
    this.sprite.setTexture(getFurnitureTextureKey(this.item.type, this.item.rotation));
    this.sprite.setOrigin(0.5, this.wallMounted ? 0.5 : 1);
    this.sprite.setScale(this.item.scale);
    this.sprite.setRotation(this.getSpriteRotation());
    this.label?.setY(this.wallMounted ? 54 : 14);
    this.interactionPoint.set(this.item.x, this.item.y).add(this.interactionOffset(this.item.type, this.wallMounted));
    this.setSize(this.wallMounted ? 150 : 120, this.wallMounted ? 120 : 100);
    if (this.wallMounted) {
      this.setDepth(-68);
    } else {
      DepthSorter.applyByY(this);
    }
  }

  private interactionOffset(type: FurnitureType, wallMounted: boolean): Phaser.Math.Vector2 {
    if (wallMounted) return new Phaser.Math.Vector2(0, 58);
    switch (type) {
      case FurnitureType.Bed:
        return new Phaser.Math.Vector2(6, -10);
      case FurnitureType.Chair:
        return new Phaser.Math.Vector2(0, 22);
      case FurnitureType.Desk:
        return new Phaser.Math.Vector2(4, 34);
      case FurnitureType.Sofa:
        return new Phaser.Math.Vector2(0, 18);
      case FurnitureType.Rug:
        return new Phaser.Math.Vector2(0, -8);
      case FurnitureType.CoffeeTable:
      case FurnitureType.TvCabinet:
        return new Phaser.Math.Vector2(0, 26);
      case FurnitureType.Wardrobe:
      case FurnitureType.Bookshelf:
        return new Phaser.Math.Vector2(0, 36);
      default:
        return new Phaser.Math.Vector2(0, 24);
    }
  }

  private isWallMounted(item: FurnitureSaveData): boolean {
    return item.surface === "wall" || item.type === FurnitureType.Decoration || item.type === FurnitureType.Painting;
  }

  private getSpriteRotation(): number {
    return 0;
  }
}
