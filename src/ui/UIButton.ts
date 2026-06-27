import Phaser from "phaser";
import { AnimalButtonState, AnimalButtonVariant, AnimalIslandTheme } from "./AnimalIslandTheme";

export type UIButtonOptions = {
  variant?: AnimalButtonVariant;
  iconKey?: string;
  iconSize?: number;
  fontSize?: number;
};

export class UIButton extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private icon?: Phaser.GameObjects.Image;
  private enabled = true;
  private visualState: AnimalButtonState = "default";
  private readonly widthValue: number;
  private readonly heightValue: number;
  private readonly variant: AnimalButtonVariant;
  private readonly iconSize: number;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick: () => void, width = 220, height = 58, options: UIButtonOptions = {}) {
    super(scene, x, y);
    this.widthValue = width;
    this.heightValue = height;
    this.variant = options.variant ?? "primary";
    this.iconSize = options.iconSize ?? 30;
    this.bg = scene.add.graphics();
    this.draw();
    if (options.iconKey && scene.textures.exists(options.iconKey)) {
      this.icon = scene.add.image(0, 0, options.iconKey).setDisplaySize(this.iconSize, this.iconSize);
    }
    this.label = scene.add.text(0, 0, text, {
      ...AnimalIslandTheme.textStyle(options.fontSize ?? Math.min(22, Math.max(16, height * 0.36)), AnimalIslandTheme.colors.text, {
        fontStyle: "bold"
      })
    }).setOrigin(0.5);
    this.add([this.bg]);
    if (this.icon) this.add(this.icon);
    this.add(this.label);
    this.layoutContent();
    this.setSize(width, height);
    this.setInteractive({ useHandCursor: true });
    this.on("pointerover", () => {
      if (!this.enabled) return;
      this.visualState = "hover";
      this.draw();
    });
    this.on("pointerdown", () => {
      if (!this.enabled) return;
      this.visualState = "pressed";
      this.draw();
    });
    this.on("pointerup", () => {
      if (!this.enabled) return;
      this.visualState = "hover";
      this.draw();
      onClick();
    });
    this.on("pointerout", () => {
      this.visualState = this.enabled ? "default" : "disabled";
      this.draw();
    });
    scene.add.existing(this);
  }

  setEnabled(enabled: boolean): this {
    this.enabled = enabled;
    this.visualState = enabled ? "default" : "disabled";
    this.draw();
    this.label.setAlpha(enabled ? 1 : 0.5);
    this.icon?.setAlpha(enabled ? 1 : 0.45);
    if (enabled) {
      this.setInteractive({ useHandCursor: true });
    } else {
      this.disableInteractive();
    }
    return this;
  }

  setText(text: string): this {
    this.label.setText(text);
    this.layoutContent();
    return this;
  }

  private draw(): void {
    AnimalIslandTheme.drawButton(this.bg, this.widthValue, this.heightValue, this.visualState, this.variant);
  }

  private layoutContent(): void {
    if (!this.icon) {
      this.label.setPosition(0, 0);
      return;
    }
    const gap = 9;
    const totalWidth = this.iconSize + gap + this.label.displayWidth;
    this.icon.setPosition(-totalWidth / 2 + this.iconSize / 2, 0);
    this.label.setPosition(this.icon.x + this.iconSize / 2 + gap + this.label.displayWidth / 2, 0);
  }
}
