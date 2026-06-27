import Phaser from "phaser";

export type AudioSettings = {
  masterVolume: number;
  sfxEnabled: boolean;
};

const USER_SETTINGS_KEY = "spring_bud_letter_user_settings_v1";
const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  masterVolume: 0.8,
  sfxEnabled: true
};

export class UserSettingsSystem {
  static loadAudioSettings(): AudioSettings {
    const raw = localStorage.getItem(USER_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_AUDIO_SETTINGS };

    try {
      return this.normalizeAudioSettings(JSON.parse(raw) as Partial<AudioSettings>);
    } catch {
      return { ...DEFAULT_AUDIO_SETTINGS };
    }
  }

  static saveAudioSettings(settings: AudioSettings): AudioSettings {
    const normalized = this.normalizeAudioSettings(settings);
    localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(normalized));
    return normalized;
  }

  static setMasterVolume(value: number): AudioSettings {
    const settings = this.loadAudioSettings();
    return this.saveAudioSettings({
      ...settings,
      masterVolume: this.clampVolume(value)
    });
  }

  static setSfxEnabled(enabled: boolean): AudioSettings {
    const settings = this.loadAudioSettings();
    return this.saveAudioSettings({
      ...settings,
      sfxEnabled: enabled
    });
  }

  static applyToScene(scene: Phaser.Scene): AudioSettings {
    const settings = this.loadAudioSettings();
    scene.sound.volume = settings.masterVolume;
    return settings;
  }

  private static normalizeAudioSettings(settings: Partial<AudioSettings>): AudioSettings {
    return {
      masterVolume: this.clampVolume(settings.masterVolume),
      sfxEnabled: settings.sfxEnabled ?? DEFAULT_AUDIO_SETTINGS.sfxEnabled
    };
  }

  private static clampVolume(value: unknown): number {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return DEFAULT_AUDIO_SETTINGS.masterVolume;
    }
    return Phaser.Math.Clamp(value, 0, 1);
  }
}
