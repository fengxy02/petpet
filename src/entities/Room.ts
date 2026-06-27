import Phaser from "phaser";
import { DEFAULT_ROOM_SURFACE_THEME, ROOM_LAYOUT, RoomPoint, RoomSurfaceTheme, clampPointToSingleFloor, pointInPolygon } from "../data/roomLayout";
import { SaveData } from "../data/types";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { AssetKeys } from "../utils/AssetKeys";
import { Furniture } from "./Furniture";

const ROOM_WIDTH = 1280;
const ROOM_HEIGHT = 720;

export class Room {
  readonly quietPoint = new Phaser.Math.Vector2(ROOM_LAYOUT.quietPoint.x, ROOM_LAYOUT.quietPoint.y);
  readonly furniture: Furniture[] = [];

  constructor(private scene: Phaser.Scene, save: SaveData, private theme: RoomSurfaceTheme = DEFAULT_ROOM_SURFACE_THEME) {
    this.drawShell();
    for (const item of save.room.furnitureItems.filter((candidate) => candidate.isPlaced !== false)) {
      this.furniture.push(new Furniture(scene, item));
    }
  }

  getRandomPointOnFloor(): Phaser.Math.Vector2 {
    const bounds = ROOM_LAYOUT.floorBounds;
    for (let attempt = 0; attempt < 80; attempt++) {
      const point = {
        x: Phaser.Math.Between(bounds.x + 44, bounds.x + bounds.width - 44),
        y: Phaser.Math.Between(bounds.y + 28, bounds.y + bounds.height - 44)
      };
      if (pointInPolygon(point, ROOM_LAYOUT.floor)) {
        return new Phaser.Math.Vector2(point.x, point.y);
      }
    }

    const fallback = clampPointToSingleFloor(ROOM_LAYOUT.petStartPoint);
    return new Phaser.Math.Vector2(fallback.x, fallback.y);
  }

  getFurnitureById(id: string): Furniture | undefined {
    return this.furniture.find((item) => item.item.id === id);
  }

  private drawShell(): void {
    this.scene.add.rectangle(640, 360, ROOM_WIDTH, ROOM_HEIGHT, AnimalIslandTheme.colors.cream).setDepth(-170);
    this.addLayerImage(AssetKeys.Room.CosyBackground, 640, 360, ROOM_WIDTH, ROOM_HEIGHT, -160, 1);
  }

  private createSurfaceTextures(): void {
    if (!this.scene.textures.exists(this.theme.wallpaper.key)) {
      const size = this.theme.wallpaper.size;
      const g = this.scene.add.graphics();
      g.setVisible(false);
      g.fillStyle(this.theme.wallpaper.baseColor, 1).fillRect(0, 0, size, size);
      g.lineStyle(1, this.theme.wallpaper.stripeColor, 0.72);
      for (let x = 8; x < size; x += 16) {
        g.lineBetween(x, 0, x, size);
      }
      g.fillStyle(this.theme.wallpaper.dotColor, 0.32);
      g.fillCircle(16, 18, 2);
      g.fillCircle(46, 42, 2);
      g.fillCircle(30, 58, 1.5);
      g.generateTexture(this.theme.wallpaper.key, size, size);
      g.destroy();
    }

    if (!this.scene.textures.exists(this.theme.flooring.key)) {
      const { width, height } = this.theme.flooring;
      const g = this.scene.add.graphics();
      g.setVisible(false);
      g.fillStyle(this.theme.flooring.baseColor, 1).fillRect(0, 0, width, height);
      g.lineStyle(2, this.theme.flooring.plankColor, 0.55);
      g.lineBetween(0, 0, width, 0);
      g.lineBetween(0, height / 2, width, height / 2);
      g.lineBetween(0, height - 1, width, height - 1);
      g.lineStyle(1, this.theme.flooring.grainColor, 0.48);
      for (let y = 12; y < height; y += 18) {
        g.lineBetween(12, y, width - 16, y + 5);
      }
      g.generateTexture(this.theme.flooring.key, width, height);
      g.destroy();
    }
  }

  private addSurface(polygon: readonly RoomPoint[], textureKey: string, depth: number, alpha: number, angle = 0): void {
    const surface = this.scene.add.tileSprite(640, 360, 1600, 1000, textureKey).setDepth(depth).setAlpha(alpha).setAngle(angle);
    surface.setMask(this.createPolygonMask(polygon));
  }

  private createPolygonMask(polygon: readonly RoomPoint[]): Phaser.Display.Masks.GeometryMask {
    const g = this.scene.add.graphics();
    g.setVisible(false);
    g.fillStyle(0xffffff, 1).fillPoints(polygon.map((point) => ({ x: point.x, y: point.y })), true);
    return g.createGeometryMask();
  }

  private addLayerImage(key: string, x: number, y: number, width: number, height: number, depth: number, alpha: number): void {
    this.scene.add.image(x, y, key).setDisplaySize(width, height).setDepth(depth).setAlpha(alpha);
  }

  private drawFixedStructures(): void {
    this.addLayerImage(AssetKeys.Room.Balcony, ROOM_LAYOUT.balconyPoint.x, ROOM_LAYOUT.balconyPoint.y, 320, 230, -140, 0.92);
    this.addLayerImage(AssetKeys.Room.Window, ROOM_LAYOUT.windowPoint.x, ROOM_LAYOUT.windowPoint.y, 300, 230, -70, 1);
    const g = this.scene.add.graphics();
    g.setDepth(-69);
    g.fillStyle(AnimalIslandTheme.colors.creamSoft, 0.88).fillRoundedRect(498, 352, 284, 32, 16);
    g.lineStyle(3, this.theme.trimColor, 0.72).strokeRoundedRect(498, 352, 284, 32, 16);
    g.lineStyle(4, AnimalIslandTheme.colors.teal, 0.48);
    g.lineBetween(522, 365, 758, 365);
    g.lineBetween(545, 350, 545, 380);
    g.lineBetween(735, 350, 735, 380);
  }

  private drawTrimAndShadows(): void {
    const g = this.scene.add.graphics();
    g.setDepth(-128);
    g.fillStyle(this.theme.shadowColor, this.theme.shadowAlpha).fillPoints(
      [
        { x: 170, y: 405 },
        { x: 1110, y: 405 },
        { x: 1140, y: 458 },
        { x: 140, y: 458 }
      ],
      true
    );
    g.lineStyle(7, this.theme.trimColor, 0.62);
    g.lineBetween(170, 405, 1110, 405);
    g.lineBetween(170, 110, 170, 405);
    g.lineBetween(1110, 110, 1110, 405);
    g.lineStyle(3, AnimalIslandTheme.colors.teal, 0.34);
    g.strokePoints(ROOM_LAYOUT.floor.map((point) => ({ x: point.x, y: point.y })), true);
    g.lineBetween(0, 210, 170, 110);
    g.lineBetween(1110, 110, 1280, 210);
  }
}
