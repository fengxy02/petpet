import Phaser from "phaser";
import { FurnitureSaveData, FurnitureType, GrowthStage, PetState } from "../data/types";
import { Furniture } from "../entities/Furniture";
import { FloatingText } from "../entities/FloatingText";
import { Pet } from "../entities/Pet";
import { Pot } from "../entities/Pot";
import { Room } from "../entities/Room";
import { GameEvents } from "../game/GameEvents";
import { DateSystem } from "../systems/DateSystem";
import { GameFlowSystem } from "../systems/GameFlowSystem";
import { DailyEventResult, RandomEventSystem } from "../systems/RandomEventSystem";
import { LetterSystem } from "../systems/LetterSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { StatusBar } from "../ui/StatusBar";
import { TextModal } from "../ui/TextModal";
import { AssetKeys } from "../utils/AssetKeys";
import { stageLabel } from "../utils/TextUtils";

export class MainRoomScene extends Phaser.Scene {
  private pet?: Pet;
  private save = SaveSystem.loadSave();

  constructor() {
    super("MainRoomScene");
  }

  create(): void {
    const save = SaveSystem.loadSave();
    if (!save) {
      this.scene.start("StartScene");
      return;
    }
    this.save = save;
    if (save.dayCount >= 7 && !save.adultFormGenerated) {
      this.scene.start("AdultFormScene");
      return;
    }
    const room = new Room(this, save);
    const pot = new Pot(this, save.pot, save.growthStage);
    pot.syncToStagePlacement(save.growthStage);
    if (save.growthStage === GrowthStage.BabyPet || (save.growthStage === GrowthStage.AdultPet && save.adultFormGenerated)) {
      this.pet = new Pet(this, save, room);
    }
    for (const furniture of room.furniture) {
      furniture.on("pointerup", () => this.handleFurnitureClick(furniture.item));
    }
    this.events.on(GameEvents.PetInteraction, (furniture: FurnitureSaveData, action: PetState | string) => {
      save.interactionRecords.push({
        day: save.dayCount,
        furnitureType: furniture.type,
        action,
        timestamp: new Date().toISOString()
      });
      SaveSystem.saveGame(save);
    });
    this.drawHud(save);
    const dailyEventResult = this.tryDailyEvent(save);
    this.showDailyMessages(save, dailyEventResult);
  }

  update(time: number): void {
    this.pet?.update(time);
  }

  private handleFurnitureClick(item: FurnitureSaveData): void {
    const save = this.save;
    if (!save) return;
    if (item.type === FurnitureType.Wardrobe && save.growthStage === GrowthStage.AdultPet && save.adultFormGenerated) {
      SaveSystem.saveGame(save);
      this.scene.start("WardrobeScene");
      return;
    }
    if (!this.pet) {
      FloatingText.show(this, item.x, item.y - 80, "它还在慢慢长大。");
      return;
    }
    const roomFurniture = this.children.list.find((child): child is Furniture => child instanceof Furniture && child.item.id === item.id);
    if (roomFurniture) {
      this.pet.moveToFurniture(roomFurniture);
    }
  }

  private drawHud(save: NonNullable<typeof this.save>): void {
    const top = this.add.graphics().setDepth(820);
    AnimalIslandTheme.drawTopStrip(top);
    this.add.text(38, 22, `Day ${save.dayCount}`, AnimalIslandTheme.textStyle(28, AnimalIslandTheme.colors.text, { fontStyle: "bold" })).setDepth(821);
    this.add.text(40, 55, stageLabel(save.growthStage), AnimalIslandTheme.textStyle(18, AnimalIslandTheme.colors.mutedText)).setDepth(821);
    new StatusBar(this, 290, 30, "心情", save.pet.mood, 0xf8a6b2).setDepth(822);
    new StatusBar(this, 520, 30, "精力", save.pet.energy, 0xf5c31c).setDepth(822);
    new StatusBar(this, 750, 30, "亲密", save.pet.intimacy, 0x19c8b9).setDepth(822);

    new UIButton(this, 1160, 140, "写信", () => this.scene.start("LetterScene"), 156, 50, { iconKey: AssetKeys.UI.IconLetter, iconSize: 26 }).setDepth(830);
    new UIButton(this, 1160, 202, "收藏", () => this.scene.start("CollectionScene"), 156, 50, { iconKey: AssetKeys.UI.IconCollection, iconSize: 26 }).setDepth(830);
    if (save.growthStage === GrowthStage.AdultPet && save.adultFormGenerated) {
      new UIButton(this, 1160, 264, "换装", () => this.scene.start("WardrobeScene"), 156, 50, { iconKey: AssetKeys.UI.IconWardrobe, iconSize: 26 }).setDepth(830);
    }
    new UIButton(this, 1160, 326, "设置", () => this.scene.start("SettingsScene", { returnScene: "MainRoomScene" }), 156, 50, {
      iconKey: AssetKeys.UI.IconSettings,
      iconSize: 26,
      variant: "default"
    }).setDepth(830);
    new UIButton(this, 1160, 388, "布置", () => this.scene.start("RoomArrangeScene"), 156, 50, { iconKey: AssetKeys.UI.IconArrange, iconSize: 26 }).setDepth(830);
    if (save.seedPlanted && save.dayCount < 7) {
      new UIButton(this, 1160, 584, "进入下一天", () => this.continueToNextDay(), 176, 52, { iconKey: AssetKeys.UI.IconLeaf, iconSize: 26, variant: "primary", fontSize: 18 }).setDepth(830);
    }
    if (import.meta.env.DEV) {
      new UIButton(this, 1160, 646, "Debug 下一天", () => {
        DateSystem.debugNextDay(save);
        SaveSystem.saveGame(save);
        this.scene.start(GameFlowSystem.getEntryScene(save));
      }, 176, 48, { variant: "ghost", fontSize: 16 }).setDepth(830);
    }
    const hint = this.getGoalHint(save);
    const hintBg = this.add.graphics().setDepth(820);
    AnimalIslandTheme.drawCard(hintBg, 250, 654, 780, 44, { fill: AnimalIslandTheme.colors.creamSoft, border: AnimalIslandTheme.colors.borderLight, radius: 22, alpha: 0.92 });
    this.add.text(640, 676, hint, AnimalIslandTheme.textStyle(19, AnimalIslandTheme.colors.bodyText)).setOrigin(0.5).setDepth(821);
  }

  private continueToNextDay(): void {
    const save = this.save;
    if (!save || !save.seedPlanted || save.dayCount >= 7) return;
    DateSystem.advancePreviewDay(save);
    SaveSystem.saveGame(save);
    this.scene.start(GameFlowSystem.getEntryScene(save));
  }

  private tryDailyEvent(save: NonNullable<typeof this.save>): DailyEventResult {
    const result = RandomEventSystem.tryGenerateDailyEvent(save);
    SaveSystem.saveGame(save);
    return result;
  }

  private showDailyMessages(save: NonNullable<typeof this.save>, dailyEventResult: DailyEventResult): void {
    const modalNotices: Array<{ title: string; body: string; buttonText: string; onClose?: () => void }> = [];
    const progress = save.lastLoginProgress;
    if (progress && !progress.read && progress.date === save.currentDate) {
      modalNotices.push({
        title: "新的一天",
        body: progress.message,
        buttonText: "知道了",
        onClose: () => {
          progress.read = true;
          SaveSystem.saveGame(save);
        }
      });
    }
    if (dailyEventResult.item) {
      modalNotices.push({
        title: dailyEventResult.forced ? "它终于带回了收藏" : "新的收藏",
        body: dailyEventResult.item.description,
        buttonText: "收下"
      });
    }

    const showQuietNoEventFeedback = (): void => {
      if (!dailyEventResult.checked || dailyEventResult.item || !dailyEventResult.message) return;
      this.time.delayedCall(500, () => FloatingText.show(this, 640, 612, dailyEventResult.message ?? ""));
    };

    const showNext = (): void => {
      const next = modalNotices.shift();
      if (!next) {
        showQuietNoEventFeedback();
        return;
      }
      new TextModal(this, next.title, next.body, next.buttonText, () => {
        next.onClose?.();
        showNext();
      });
    };

    showNext();
  }

  private getGoalHint(save: NonNullable<typeof this.save>): string {
    if (save.dayCount <= 3) return "今日目标：照看花盆，明天再看看它长出什么。";
    if (!LetterSystem.hasLetterForToday(save)) return "今日目标：写一封信，让它把今天记住。";
    if (save.growthStage === GrowthStage.AdultPet && save.adultFormGenerated) return "今日目标：陪它互动，收集小礼物，试试新的装扮。";
    return "今日目标：点一点家具，看看它喜欢在小屋里做什么。";
  }
}
