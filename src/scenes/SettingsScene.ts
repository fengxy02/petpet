import Phaser from "phaser";
import { SaveSystem } from "../systems/SaveSystem";
import { AudioSettings, UserSettingsSystem } from "../systems/UserSettingsSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { ChoiceModal } from "../ui/ChoiceModal";
import { UIButton } from "../ui/UIButton";
import { UIPanel } from "../ui/UIPanel";

const SLIDER_WIDTH = 360;
const TOGGLE_WIDTH = 92;
const TOGGLE_HEIGHT = 44;

type SettingsSceneData = {
  returnScene?: string;
};

export class SettingsScene extends Phaser.Scene {
  private audioSettings: AudioSettings = UserSettingsSystem.loadAudioSettings();
  private returnScene = "StartScene";

  constructor() {
    super("SettingsScene");
  }

  init(data: SettingsSceneData = {}): void {
    this.returnScene = data.returnScene ?? "StartScene";
  }

  create(): void {
    AnimalIslandTheme.sceneBackground(this);
    this.audioSettings = UserSettingsSystem.applyToScene(this);

    new UIPanel(this, 640, 360, 680, 520, "\u8bbe\u7f6e");

    this.add.text(430, 230, "\u97f3\u91cf", {
      ...AnimalIslandTheme.textStyle(24, AnimalIslandTheme.colors.text),
      fontStyle: "bold"
    }).setOrigin(0, 0.5);

    const volumeValue = this.add.text(850, 230, this.formatPercent(this.audioSettings.masterVolume), {
      ...AnimalIslandTheme.textStyle(22, AnimalIslandTheme.colors.mutedText)
    }).setOrigin(1, 0.5);

    this.createVolumeSlider(640, 290, SLIDER_WIDTH, this.audioSettings.masterVolume, (value) => {
      this.audioSettings = UserSettingsSystem.setMasterVolume(value);
      this.sound.volume = this.audioSettings.masterVolume;
      volumeValue.setText(this.formatPercent(this.audioSettings.masterVolume));
    });

    this.add.text(430, 365, "\u97f3\u6548", {
      ...AnimalIslandTheme.textStyle(24, AnimalIslandTheme.colors.text),
      fontStyle: "bold"
    }).setOrigin(0, 0.5);

    const sfxValue = this.add.text(780, 365, this.audioSettings.sfxEnabled ? "\u5f00" : "\u5173", {
      ...AnimalIslandTheme.textStyle(22, AnimalIslandTheme.colors.mutedText)
    }).setOrigin(0, 0.5);

    this.createSfxToggle(700, 365, this.audioSettings.sfxEnabled, (enabled) => {
      this.audioSettings = UserSettingsSystem.setSfxEnabled(enabled);
      sfxValue.setText(this.audioSettings.sfxEnabled ? "\u5f00" : "\u5173");
    });

    new UIButton(this, 640, 450, "\u91cd\u65b0\u5f00\u59cb", () => this.confirmRestart(), 260, 58, { variant: "danger" });
    new UIButton(this, 640, 530, "\u8fd4\u56de", () => this.returnFromSettings(), 260, 58, { variant: "primary" });
  }

  private createVolumeSlider(x: number, y: number, width: number, initialValue: number, onChange: (value: number) => void): Phaser.GameObjects.Container {
    const slider = this.add.container(x, y);
    const track = this.add.graphics();
    const thumb = this.add.circle(0, 0, 15, AnimalIslandTheme.colors.creamSoft).setStrokeStyle(3, AnimalIslandTheme.colors.border);
    const hitArea = this.add.zone(0, 0, width, 46).setOrigin(0.5).setInteractive({ useHandCursor: true });
    let value = Phaser.Math.Clamp(initialValue, 0, 1);
    let dragging = false;

    const redraw = (): void => {
      track.clear();
      track.fillStyle(AnimalIslandTheme.colors.creamWarm, 1).fillRoundedRect(-width / 2, -5, width, 10, 5);
      track.fillStyle(AnimalIslandTheme.colors.teal, 1).fillRoundedRect(-width / 2, -5, width * value, 10, 5);
      track.lineStyle(2, AnimalIslandTheme.colors.borderLight, 1).strokeRoundedRect(-width / 2, -5, width, 10, 5);
      thumb.x = -width / 2 + width * value;
    };

    const updateFromPointer = (pointer: Phaser.Input.Pointer): void => {
      const nextValue = Phaser.Math.Clamp((pointer.x - (x - width / 2)) / width, 0, 1);
      value = Math.round(nextValue * 100) / 100;
      redraw();
      onChange(value);
    };

    const handlePointerMove = (pointer: Phaser.Input.Pointer): void => {
      if (!dragging) return;
      updateFromPointer(pointer);
    };

    const handlePointerUp = (): void => {
      dragging = false;
    };

    hitArea.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      dragging = true;
      updateFromPointer(pointer);
    });

    this.input.on("pointermove", handlePointerMove);
    this.input.on("pointerup", handlePointerUp);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off("pointermove", handlePointerMove);
      this.input.off("pointerup", handlePointerUp);
    });

    slider.add([track, thumb, hitArea]);
    redraw();
    return slider;
  }

  private createSfxToggle(x: number, y: number, initialValue: boolean, onChange: (enabled: boolean) => void): Phaser.GameObjects.Container {
    const toggle = this.add.container(x, y);
    const bg = this.add.graphics();
    const knob = this.add.circle(0, 0, 17, AnimalIslandTheme.colors.creamSoft).setStrokeStyle(2, AnimalIslandTheme.colors.borderLight);
    const hitArea = this.add.zone(0, 0, TOGGLE_WIDTH, TOGGLE_HEIGHT).setOrigin(0.5).setInteractive({ useHandCursor: true });
    let enabled = initialValue;

    const redraw = (): void => {
      bg.clear();
      bg.fillStyle(enabled ? AnimalIslandTheme.colors.teal : AnimalIslandTheme.colors.creamWarm, 1).fillRoundedRect(-TOGGLE_WIDTH / 2, -TOGGLE_HEIGHT / 2, TOGGLE_WIDTH, TOGGLE_HEIGHT, TOGGLE_HEIGHT / 2);
      bg.lineStyle(3, enabled ? AnimalIslandTheme.colors.tealActive : AnimalIslandTheme.colors.borderWarm, 1).strokeRoundedRect(-TOGGLE_WIDTH / 2, -TOGGLE_HEIGHT / 2, TOGGLE_WIDTH, TOGGLE_HEIGHT, TOGGLE_HEIGHT / 2);
      knob.x = enabled ? 24 : -24;
    };

    hitArea.on("pointerup", () => {
      enabled = !enabled;
      redraw();
      onChange(enabled);
    });

    toggle.add([bg, knob, hitArea]);
    redraw();
    return toggle;
  }

  private confirmRestart(): void {
    new ChoiceModal(this, "\u91cd\u65b0\u5f00\u59cb", "\u8fd9\u4f1a\u6e05\u9664\u5f53\u524d\u5c0f\u5c4b\u8bb0\u5f55\uff0c\u5e76\u5f00\u59cb\u4e00\u6bb5\u65b0\u7684\u65c5\u7a0b\u3002", [
      { label: "\u786e\u8ba4\u91cd\u5f00", onClick: () => {
        SaveSystem.clearSave();
        SaveSystem.createNewSave();
        this.scene.start("SeedRitualScene");
      } },
      { label: "\u53d6\u6d88", onClick: () => undefined }
    ]);
  }

  private returnFromSettings(): void {
    this.scene.start(this.returnScene);
  }

  private formatPercent(value: number): string {
    return `${Math.round(value * 100)}%`;
  }
}
