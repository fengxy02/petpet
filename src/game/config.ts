import Phaser from "phaser";
import { AdultFormScene } from "../scenes/AdultFormScene";
import { BootScene } from "../scenes/BootScene";
import { CollectionScene } from "../scenes/CollectionScene";
import { DailySummaryScene } from "../scenes/DailySummaryScene";
import { LetterScene } from "../scenes/LetterScene";
import { MainRoomScene } from "../scenes/MainRoomScene";
import { PreloadScene } from "../scenes/PreloadScene";
import { QuestionScene } from "../scenes/QuestionScene";
import { RoomArrangeScene } from "../scenes/RoomArrangeScene";
import { SeedRitualScene } from "../scenes/SeedRitualScene";
import { SettingsScene } from "../scenes/SettingsScene";
import { StartScene } from "../scenes/StartScene";
import { WardrobeScene } from "../scenes/WardrobeScene";

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#f8efe0",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  dom: {
    createContainer: true
  },
  scene: [
    BootScene,
    PreloadScene,
    StartScene,
    SeedRitualScene,
    MainRoomScene,
    RoomArrangeScene,
    LetterScene,
    DailySummaryScene,
    QuestionScene,
    AdultFormScene,
    WardrobeScene,
    CollectionScene,
    SettingsScene
  ]
};
