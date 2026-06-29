import Phaser from "phaser";
import { AnimalIslandTheme } from "./AnimalIslandTheme";
import { UIButton } from "./UIButton";
import { UIPanel } from "./UIPanel";

type TextModalOptions = {
  frameKey?: string;
  width?: number;
  height?: number;
  panelY?: number;
  shadeAlpha?: number;
  bodyWidth?: number;
  bodyHeight?: number;
  bodyTop?: number;
  bodyFontSize?: number;
  buttonY?: number;
  buttonWidth?: number;
  buttonHeight?: number;
};

export class TextModal extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, title: string, body: string, buttonText: string, onClose: () => void, options: TextModalOptions = {}) {
    super(scene, 640, 360);
    this.setDepth(10000);
    const width = options.width ?? 620;
    const height = options.height ?? 360;
    const panelY = options.panelY ?? 0;
    const bodyWidth = options.bodyWidth ?? width - 120;
    const bodyHeight = options.bodyHeight ?? height - (title ? 180 : 145);
    const bodyTop = options.bodyTop ?? panelY - bodyHeight / 2 - (title ? 12 : 28);
    const buttonY = options.buttonY ?? panelY + height / 2 - 55;
    const shade = scene.add.rectangle(0, 0, 1280, 720, AnimalIslandTheme.colors.shadow, options.shadeAlpha ?? 0.26).setInteractive();
    const panel = options.frameKey
      ? scene.add.image(0, panelY, options.frameKey).setDisplaySize(width, height)
      : new UIPanel(scene, 0, panelY, width, height, title || undefined);
    const children: Phaser.GameObjects.GameObject[] = [shade, panel];

    if (options.frameKey && title) {
      children.push(
        scene.add
          .text(0, panelY - height / 2 + 66, title, {
            ...AnimalIslandTheme.textStyle(26, AnimalIslandTheme.colors.text, { fontStyle: "bold" })
          })
          .setOrigin(0.5)
      );
    }

    const text = scene.add.text(0, bodyTop, body, {
      ...AnimalIslandTheme.textStyle(options.bodyFontSize ?? 22, AnimalIslandTheme.colors.bodyText),
      align: "center",
      wordWrap: { width: bodyWidth },
      lineSpacing: 8
    }).setOrigin(0.5, 0);

    const maskShape = scene.add.graphics().setAlpha(0);
    maskShape.fillStyle(0xffffff, 1).fillRect(640 - bodyWidth / 2, 360 + bodyTop, bodyWidth, bodyHeight);
    const mask = maskShape.createGeometryMask();
    text.setMask(mask);

    const maxScroll = Math.max(0, text.height - bodyHeight);
    let scrollY = 0;
    const scrollbar = scene.add.graphics();
    const drawScrollbar = (): void => {
      scrollbar.clear();
      if (maxScroll <= 0) return;
      const trackX = bodyWidth / 2 + 22;
      const trackTop = bodyTop;
      const trackHeight = bodyHeight;
      const thumbHeight = Math.max(34, (bodyHeight / text.height) * trackHeight);
      const thumbY = trackTop + (scrollY / maxScroll) * (trackHeight - thumbHeight);
      scrollbar.fillStyle(AnimalIslandTheme.colors.borderLight, 0.45).fillRoundedRect(trackX, trackTop, 5, trackHeight, 3);
      scrollbar.fillStyle(AnimalIslandTheme.colors.teal, 0.78).fillRoundedRect(trackX - 1, thumbY, 7, thumbHeight, 4);
    };
    const applyScroll = (delta: number): void => {
      if (maxScroll <= 0) return;
      scrollY = Phaser.Math.Clamp(scrollY + delta, 0, maxScroll);
      text.setY(bodyTop - scrollY);
      drawScrollbar();
    };
    const wheelHandler = (_pointer: Phaser.Input.Pointer, _objects: Phaser.GameObjects.GameObject[], _deltaX: number, deltaY: number): void => {
      applyScroll(deltaY * 0.35);
    };
    scene.input.on("wheel", wheelHandler);
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      scene.input.off("wheel", wheelHandler);
      mask.destroy();
      maskShape.destroy();
    });
    drawScrollbar();

    const button = new UIButton(scene, 0, buttonY, buttonText, () => {
      this.destroy();
      onClose();
    }, options.buttonWidth ?? 210, options.buttonHeight ?? 58, { variant: "primary" });
    children.push(maskShape, text, scrollbar, button);
    this.add(children);
    scene.add.existing(this);
  }
}
