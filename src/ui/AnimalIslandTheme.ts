import Phaser from "phaser";

export type AnimalButtonVariant = "default" | "primary" | "ghost" | "danger";
export type AnimalButtonState = "default" | "hover" | "pressed" | "disabled";

const animalColors = {
  cream: 0xf8f8f0,
  creamContent: 0xf7f3df,
  creamSoft: 0xfffbef,
  creamWarm: 0xf0e8d8,
  teal: 0x19c8b9,
  tealHover: 0x3dd4c6,
  tealActive: 0x50b9ab,
  green: 0x6fba2c,
  yellow: 0xf5c31c,
  peach: 0xf8a6b2,
  red: 0xe05a5a,
  text: 0x794f27,
  bodyText: 0x725d42,
  mutedText: 0x9f927d,
  border: 0xaaa69d,
  borderLight: 0xe8e2d6,
  borderWarm: 0xd4c9b4,
  shadow: 0x3d3428
};

const animalFontFamily = "Nunito, 'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', Arial, sans-serif";

function toAnimalHex(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}

export const AnimalIslandTheme = {
  colors: animalColors,
  fontFamily: animalFontFamily,

  hex(color: number): string {
    return toAnimalHex(color);
  },

  textStyle(size: number, color = animalColors.bodyText, extra: Phaser.Types.GameObjects.Text.TextStyle = {}): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: animalFontFamily,
      fontSize: `${size}px`,
      color: toAnimalHex(color),
      ...extra
    };
  },

  drawPanel(
    g: Phaser.GameObjects.Graphics,
    width: number,
    height: number,
    options: { radius?: number; fill?: number; border?: number; shadowAlpha?: number } = {}
  ): void {
    const radius = options.radius ?? 24;
    const fill = options.fill ?? animalColors.creamContent;
    const border = options.border ?? animalColors.border;
    const shadowAlpha = options.shadowAlpha ?? 0.12;
    g.clear();
    g.fillStyle(animalColors.shadow, shadowAlpha).fillRoundedRect(-width / 2 + 8, -height / 2 + 10, width, height, radius);
    g.fillStyle(fill, 1).fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    g.lineStyle(2.5, border, 1).strokeRoundedRect(-width / 2 + 1.5, -height / 2 + 1.5, width - 3, height - 3, radius);
    g.lineStyle(1.5, animalColors.borderLight, 0.9).strokeRoundedRect(-width / 2 + 8, -height / 2 + 8, width - 16, height - 16, Math.max(8, radius - 8));
  },

  drawCard(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
    options: { fill?: number; border?: number; radius?: number; dashed?: boolean; alpha?: number } = {}
  ): void {
    const fill = options.fill ?? animalColors.creamSoft;
    const border = options.border ?? animalColors.borderLight;
    const radius = options.radius ?? 18;
    const alpha = options.alpha ?? 1;
    g.fillStyle(animalColors.shadow, 0.06 * alpha).fillRoundedRect(x + 4, y + 5, width, height, radius);
    g.fillStyle(fill, alpha).fillRoundedRect(x, y, width, height, radius);
    g.lineStyle(2, border, alpha);
    if (options.dashed) {
      const dash = 10;
      const gap = 7;
      for (let px = x + radius; px < x + width - radius; px += dash + gap) {
        g.lineBetween(px, y, Math.min(px + dash, x + width - radius), y);
        g.lineBetween(px, y + height, Math.min(px + dash, x + width - radius), y + height);
      }
      for (let py = y + radius; py < y + height - radius; py += dash + gap) {
        g.lineBetween(x, py, x, Math.min(py + dash, y + height - radius));
        g.lineBetween(x + width, py, x + width, Math.min(py + dash, y + height - radius));
      }
    } else {
      g.strokeRoundedRect(x + 1, y + 1, width - 2, height - 2, radius);
    }
  },

  drawButton(g: Phaser.GameObjects.Graphics, width: number, height: number, state: AnimalButtonState, variant: AnimalButtonVariant = "default"): void {
    const radius = height / 2;
    const disabled = state === "disabled";
    const pressed = state === "pressed";
    const hover = state === "hover";
    const fillByVariant: Record<AnimalButtonVariant, number> = {
      default: animalColors.cream,
      primary: animalColors.cream,
      ghost: animalColors.creamSoft,
      danger: 0xfff1ed
    };
    const borderByVariant: Record<AnimalButtonVariant, number> = {
      default: hover ? animalColors.teal : animalColors.border,
      primary: animalColors.cream,
      ghost: hover ? animalColors.teal : animalColors.borderLight,
      danger: animalColors.red
    };
    const shadowColor = variant === "danger" ? 0xc94444 : animalColors.borderWarm;
    const offset = pressed ? 1 : hover ? 6 : 5;
    g.clear();
    if (variant === "primary" || variant === "danger") {
      g.fillStyle(shadowColor, disabled ? 0.32 : 1).fillRoundedRect(-width / 2, -height / 2 + offset, width, height, radius);
    } else {
      g.fillStyle(animalColors.shadow, disabled ? 0.02 : 0.07).fillRoundedRect(-width / 2 + 2, -height / 2 + 3, width, height, radius);
    }
    g.fillStyle(disabled ? animalColors.creamWarm : fillByVariant[variant], disabled ? 0.78 : 1).fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    g.lineStyle(2.5, disabled ? animalColors.borderWarm : borderByVariant[variant], disabled ? 0.55 : 1).strokeRoundedRect(-width / 2 + 1.5, -height / 2 + 1.5, width - 3, height - 3, radius);
    if (variant === "primary" && !disabled) {
      g.lineStyle(1.5, animalColors.tealHover, pressed ? 0.45 : 0.7);
      g.lineBetween(-width / 2 + 24, -height / 2 + 9, width / 2 - 24, -height / 2 + 9);
    }
  },

  drawTopStrip(g: Phaser.GameObjects.Graphics, width = 1280, height = 86): void {
    g.clear();
    g.fillStyle(animalColors.cream, 0.93).fillRoundedRect(18, 14, width - 36, height - 18, 24);
    g.lineStyle(2, animalColors.borderLight, 0.95).strokeRoundedRect(19, 15, width - 38, height - 20, 24);
  },

  drawTitlePill(g: Phaser.GameObjects.Graphics, width: number, height: number, fill = animalColors.teal): void {
    const radius = height / 2;
    g.fillStyle(0x108f84, 1).fillRoundedRect(-width / 2, -height / 2 + 4, width, height, radius);
    g.fillStyle(fill, 1).fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    g.lineStyle(2, 0xffffff, 0.72).strokeRoundedRect(-width / 2 + 3, -height / 2 + 3, width - 6, height - 6, radius);
  },

  sceneBackground(scene: Phaser.Scene): void {
    scene.cameras.main.setBackgroundColor(toAnimalHex(animalColors.cream));
  }
};
