import Phaser from "phaser";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { AssetKeys, AssetManifest, AssetManifestItem } from "./AssetKeys";

const cream = AnimalIslandTheme.colors.creamContent;
const green = AnimalIslandTheme.colors.green;
const yellow = AnimalIslandTheme.colors.yellow;
const brown = 0xb18a5f;
const pink = AnimalIslandTheme.colors.peach;
const blue = AnimalIslandTheme.colors.tealHover;
const ink = AnimalIslandTheme.colors.text;

export class PlaceholderFactory {
  static ensureAll(scene: Phaser.Scene): void {
    for (const item of AssetManifest) {
      if (!scene.textures.exists(item.key)) {
        this.create(scene, item);
      }
    }
  }

  static create(scene: Phaser.Scene, item: AssetManifestItem): void {
    const width = item.width ?? 120;
    const height = item.height ?? 90;
    const g = scene.add.graphics();
    g.clear();

    if (item.key === AssetKeys.Room.ShellBase) {
      this.drawRoomShellBase(g, width, height);
    } else if (item.key === AssetKeys.Room.Window) {
      this.drawRoomWindow(g, width, height);
    } else if (item.kind === "cover") {
      this.drawCover(g, width, height);
    } else if (item.kind === "growth") {
      this.drawGrowth(g, item.key, width, height);
    } else if (item.kind === "baby" || item.kind === "adult") {
      this.drawPet(g, item.kind, item.key, width, height);
    } else if (item.kind === "furniture") {
      this.drawFurniture(g, item.key, width, height);
    } else if (item.kind === "collection") {
      this.drawCollection(g, item.key, width, height);
    } else if (item.kind === "clothing") {
      this.drawClothing(g, item.key, width, height);
    } else if (item.kind === "button") {
      this.drawButton(g, width, height);
    } else {
      this.drawSoftTile(g, width, height, cream);
    }

    g.generateTexture(item.key, width, height);
    g.destroy();
  }

  private static drawCover(g: Phaser.GameObjects.Graphics, width: number, height: number): void {
    g.fillStyle(0xf8efe0, 1).fillRect(0, 0, width, height);
    g.fillStyle(0xf2dfba, 1).fillEllipse(260, 580, 420, 140);
    g.fillStyle(0xd9e9c4, 1).fillEllipse(980, 575, 520, 160);
    g.fillStyle(0xfffbf1, 0.82).fillRoundedRect(170, 90, 940, 470, 42);
    g.fillStyle(0xd5e7cf, 1).fillRoundedRect(910, 165, 170, 260, 36);
    g.fillStyle(0xefd59c, 1).fillEllipse(640, 420, 150, 80);
    g.fillStyle(green, 1).fillEllipse(620, 356, 42, 76);
    g.fillStyle(green, 1).fillEllipse(670, 350, 40, 70);
  }

  private static drawSoftTile(g: Phaser.GameObjects.Graphics, width: number, height: number, color: number): void {
    g.fillStyle(AnimalIslandTheme.colors.shadow, 0.08).fillRoundedRect(4, 5, width - 4, height - 4, 18);
    g.fillStyle(color, 1).fillRoundedRect(0, 0, width - 4, height - 4, 18);
    g.lineStyle(2, AnimalIslandTheme.colors.border, 1).strokeRoundedRect(2, 2, width - 8, height - 8, 16);
  }

  private static drawButton(g: Phaser.GameObjects.Graphics, width: number, height: number): void {
    g.translateCanvas(width / 2, height / 2);
    AnimalIslandTheme.drawButton(g, width - 6, height - 10, "default", "primary");
    g.translateCanvas(-width / 2, -height / 2);
  }

  private static drawRoomShellBase(g: Phaser.GameObjects.Graphics, width: number, height: number): void {
    g.clear();
    g.fillStyle(0x000000, 0).fillRect(0, 0, width, height);
    g.fillStyle(0x86684b, 0.08).fillPoints(
      [
        { x: 170, y: 405 },
        { x: 1110, y: 405 },
        { x: 1160, y: 500 },
        { x: 1200, y: 720 },
        { x: 80, y: 720 },
        { x: 120, y: 500 }
      ],
      true
    );
    g.lineStyle(5, 0x9ecf9b, 0.58);
    g.lineBetween(170, 405, 1110, 405);
    g.lineStyle(3, 0x82b986, 0.4);
    g.strokePoints(
      [
        { x: 170, y: 110 },
        { x: 1110, y: 110 },
        { x: 1110, y: 405 },
        { x: 1280, y: 720 },
        { x: 0, y: 720 },
        { x: 170, y: 405 }
      ],
      true
    );
    g.lineBetween(0, 210, 170, 110);
    g.lineBetween(1110, 110, 1280, 210);
    g.fillStyle(0xfffbef, 0.45).fillRoundedRect(498, 352, 284, 32, 16);
    g.lineStyle(3, 0x9ecf9b, 0.48).strokeRoundedRect(498, 352, 284, 32, 16);
  }

  private static drawRoomWindow(g: Phaser.GameObjects.Graphics, width: number, height: number): void {
    g.fillStyle(0x000000, 0).fillRect(0, 0, width, height);
    g.fillStyle(0xbfe3ef, 0.9).fillRoundedRect(width * 0.12, height * 0.08, width * 0.76, height * 0.7, 20);
    g.fillStyle(0xe8f6fb, 0.75).fillRoundedRect(width * 0.16, height * 0.12, width * 0.68, height * 0.62, 16);
    g.lineStyle(10, 0xfffbef, 1).strokeRoundedRect(width * 0.1, height * 0.06, width * 0.8, height * 0.75, 22);
    g.lineStyle(4, green, 0.85).strokeRoundedRect(width * 0.14, height * 0.1, width * 0.72, height * 0.66, 16);
    g.lineStyle(5, 0x82b986, 0.75);
    g.lineBetween(width * 0.5, height * 0.1, width * 0.5, height * 0.76);
    g.lineBetween(width * 0.14, height * 0.43, width * 0.86, height * 0.43);
    g.fillStyle(0xf7e0a7, 1).fillRoundedRect(width * 0.04, height * 0.75, width * 0.92, height * 0.16, 18);
    g.lineStyle(4, 0xcaa36d, 0.8).strokeRoundedRect(width * 0.04, height * 0.75, width * 0.92, height * 0.16, 18);
  }

  private static drawGrowth(g: Phaser.GameObjects.Graphics, key: string, width: number, height: number): void {
    g.fillStyle(0x000000, 0).fillRect(0, 0, width, height);
    g.fillStyle(brown, 1).fillRoundedRect(width * 0.22, height * 0.45, width * 0.56, height * 0.42, 14);
    g.fillStyle(0xc9955e, 1).fillEllipse(width * 0.5, height * 0.46, width * 0.68, height * 0.25);
    if (key.includes("soil") || key.includes("sprout")) {
      g.fillStyle(0x755039, 1).fillEllipse(width * 0.5, height * 0.44, width * 0.48, height * 0.13);
    }
    if (key.includes("sprout_small") || key.includes("sprout_growing")) {
      g.lineStyle(7, green, 1).lineBetween(width * 0.5, height * 0.43, width * 0.5, height * 0.2);
      g.fillStyle(green, 1).fillEllipse(width * 0.43, height * 0.24, width * 0.24, height * 0.16);
      g.fillStyle(0xb9dea1, 1).fillEllipse(width * 0.58, height * 0.2, width * 0.24, height * 0.16);
    }
    if (key.includes("growing")) {
      g.lineStyle(8, 0x80bd7c, 1).lineBetween(width * 0.5, height * 0.42, width * 0.5, height * 0.08);
      g.fillStyle(0x80bd7c, 1).fillEllipse(width * 0.38, height * 0.13, width * 0.3, height * 0.19);
      g.fillStyle(0xc7e8aa, 1).fillEllipse(width * 0.64, height * 0.12, width * 0.3, height * 0.19);
    }
    if (key.includes("seed")) {
      g.clear();
      g.fillStyle(0x000000, 0).fillRect(0, 0, width, height);
      g.fillStyle(0xc89558, 1).fillEllipse(width / 2, height / 2, width * 0.65, height * 0.78);
      g.fillStyle(0xf3d49a, 0.7).fillEllipse(width * 0.42, height * 0.35, width * 0.2, height * 0.18);
    }
  }

  private static drawPet(g: Phaser.GameObjects.Graphics, kind: "baby" | "adult", key: string, width: number, height: number): void {
    g.fillStyle(0x000000, 0).fillRect(0, 0, width, height);
    const bodyColor = kind === "baby" ? 0xffe3bd : this.formColor(key);
    const cx = width / 2;
    const cy = height * 0.58;
    g.fillStyle(bodyColor, 1).fillEllipse(cx, cy, width * 0.6, height * 0.58);
    g.fillStyle(0xfff7e6, 1).fillEllipse(cx, cy + height * 0.05, width * 0.38, height * 0.28);
    g.fillStyle(ink, 1).fillCircle(cx - width * 0.14, cy - height * 0.06, 4);
    g.fillStyle(ink, 1).fillCircle(cx + width * 0.14, cy - height * 0.06, 4);
    g.lineStyle(3, ink, 1).arc(cx, cy + 6, 13, 0.15, Math.PI - 0.15, false);
    g.fillStyle(0xf8d487, 1).fillEllipse(cx, height * 0.32, width * 0.44, height * 0.22);
    g.lineStyle(6, green, 1).lineBetween(cx, height * 0.28, cx, height * 0.08);
    g.fillStyle(green, 1).fillEllipse(cx - 18, height * 0.11, width * 0.21, height * 0.13);
    g.fillStyle(0xc4e5a6, 1).fillEllipse(cx + 18, height * 0.1, width * 0.21, height * 0.13);
    if (key.includes("sleep")) {
      g.fillStyle(blue, 1).fillCircle(width * 0.78, height * 0.18, 8);
      g.fillCircle(width * 0.86, height * 0.1, 5);
    }
    if (key.includes("question")) {
      g.fillStyle(yellow, 1).fillCircle(width * 0.82, height * 0.16, 16);
      g.fillStyle(ink, 1).fillCircle(width * 0.82, height * 0.21, 2);
    }
  }

  private static formColor(key: string): number {
    if (key.includes("active")) return 0xffd29f;
    if (key.includes("craft")) return 0xf7c6bd;
    if (key.includes("travel")) return 0xb8dcbf;
    if (key.includes("sleepy")) return 0xcabce8;
    if (key.includes("quiet")) return 0xb7d3e8;
    return 0xffdfc9;
  }

  private static drawFurniture(g: Phaser.GameObjects.Graphics, key: string, width: number, height: number): void {
    g.fillStyle(0x000000, 0).fillRect(0, 0, width, height);
    g.fillStyle(0xe6c890, 1).fillRoundedRect(width * 0.12, height * 0.35, width * 0.76, height * 0.44, 12);
    g.lineStyle(4, brown, 1).strokeRoundedRect(width * 0.12, height * 0.35, width * 0.76, height * 0.44, 12);
    if (key.includes("bed")) {
      g.fillStyle(0xf2b7a7, 1).fillRoundedRect(width * 0.15, height * 0.2, width * 0.72, height * 0.32, 14);
      g.fillStyle(0xfff3da, 1).fillRoundedRect(width * 0.18, height * 0.16, width * 0.25, height * 0.24, 10);
    } else if (key.includes("chair")) {
      g.fillStyle(0xd6b071, 1).fillRoundedRect(width * 0.24, height * 0.12, width * 0.52, height * 0.44, 10);
      g.fillStyle(0xa97a52, 1).fillRect(width * 0.28, height * 0.58, 8, height * 0.3);
      g.fillRect(width * 0.64, height * 0.58, 8, height * 0.3);
    } else if (key.includes("desk")) {
      g.fillStyle(0xb98b5e, 1).fillRoundedRect(width * 0.1, height * 0.24, width * 0.8, height * 0.2, 8);
      g.fillStyle(0x8b6849, 1).fillRect(width * 0.2, height * 0.43, 10, height * 0.45);
      g.fillRect(width * 0.74, height * 0.43, 10, height * 0.45);
    } else if (key.includes("exercise")) {
      g.lineStyle(8, 0x8fb8a1, 1).lineBetween(width * 0.25, height * 0.75, width * 0.7, height * 0.22);
      g.lineBetween(width * 0.72, height * 0.75, width * 0.28, height * 0.22);
      g.fillStyle(0x6d5844, 1).fillCircle(width * 0.25, height * 0.75, 12);
      g.fillCircle(width * 0.72, height * 0.75, 12);
    } else if (key.includes("bowl")) {
      g.fillStyle(0xf3a68e, 1).fillEllipse(width * 0.5, height * 0.62, width * 0.72, height * 0.45);
      g.fillStyle(0xfff1d1, 1).fillEllipse(width * 0.5, height * 0.55, width * 0.52, height * 0.22);
    } else if (key.includes("toy")) {
      g.fillStyle(0xa9cce8, 1).fillCircle(width * 0.35, height * 0.55, width * 0.18);
      g.fillStyle(0xf4d88f, 1).fillCircle(width * 0.58, height * 0.55, width * 0.18);
    } else if (key.includes("wardrobe") || key.includes("bookshelf")) {
      g.fillStyle(0xc99762, 1).fillRoundedRect(width * 0.2, height * 0.08, width * 0.6, height * 0.82, 12);
      g.lineStyle(3, 0x7d5c3e, 1).lineBetween(width * 0.5, height * 0.12, width * 0.5, height * 0.86);
    }
  }

  private static drawCollection(g: Phaser.GameObjects.Graphics, key: string, width: number, height: number): void {
    const isPostcard = key.includes("postcard");
    g.fillStyle(isPostcard ? 0xe6f9f6 : 0xfff8e0, 1).fillRoundedRect(0, 0, width, height, 18);
    g.lineStyle(3, isPostcard ? AnimalIslandTheme.colors.teal : AnimalIslandTheme.colors.yellow, 1).strokeRoundedRect(2, 2, width - 4, height - 4, 18);
    g.fillStyle(isPostcard ? 0xffffff : 0xf5c5b0, 0.8).fillEllipse(width * 0.45, height * 0.45, width * 0.42, height * 0.28);
    g.fillStyle(green, 1).fillEllipse(width * 0.62, height * 0.55, width * 0.2, height * 0.18);
  }

  private static drawClothing(g: Phaser.GameObjects.Graphics, key: string, width: number, height: number): void {
    g.fillStyle(0x000000, 0).fillRect(0, 0, width, height);
    if (key.includes("hat")) {
      g.fillStyle(0xb7d3e8, 1).fillRoundedRect(width * 0.2, height * 0.35, width * 0.6, height * 0.32, 10);
      g.fillStyle(0x8eb6d5, 1).fillEllipse(width * 0.5, height * 0.67, width * 0.75, height * 0.18);
    } else if (key.includes("star")) {
      g.fillStyle(yellow, 1);
      const points = [];
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? width * 0.36 : width * 0.16;
        const angle = -Math.PI / 2 + (i * Math.PI) / 5;
        points.push({ x: width / 2 + Math.cos(angle) * radius, y: height / 2 + Math.sin(angle) * radius });
      }
      g.fillPoints(points, true);
    } else if (key.includes("scarf")) {
      g.fillStyle(0xf2a7a7, 1).fillRoundedRect(width * 0.12, height * 0.36, width * 0.76, height * 0.28, 10);
    } else if (key.includes("bag")) {
      g.fillStyle(0xc79b66, 1).fillRoundedRect(width * 0.2, height * 0.18, width * 0.58, height * 0.62, 12);
      g.lineStyle(4, 0x8c6540, 1).arc(width * 0.49, height * 0.22, width * 0.22, Math.PI, 0, false);
    } else {
      g.fillStyle(pink, 1).fillEllipse(width * 0.5, height * 0.5, width * 0.55, height * 0.42);
    }
  }
}
