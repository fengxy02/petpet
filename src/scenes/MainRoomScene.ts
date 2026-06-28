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
import { OpeningReplySystem } from "../systems/OpeningReplySystem";
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
    this.drawEarlyGrowthHint(save, pot);
    if (save.growthStage === GrowthStage.BabyPet || (save.growthStage === GrowthStage.AdultPet && save.adultFormGenerated)) {
      this.pet = new Pet(this, save, room);
      if (save.dayCount < 5) this.pet.disableInteractive();
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
    if ((this.save?.dayCount ?? 0) < 5) return;
    this.pet?.update(time);
  }

  private handleFurnitureClick(item: FurnitureSaveData): void {
    const save = this.save;
    if (!save) return;
    if (item.type === FurnitureType.Pot && save.dayCount <= 5) {
      FloatingText.show(this, item.x, item.y - 92, this.getPotFeedback(save.dayCount));
      return;
    }
    if (save.dayCount < 6) {
      FloatingText.show(this, item.x, item.y - 80, save.dayCount <= 3 ? "现在先照看花盆就好。" : "它还在适应小屋，明天再试试。");
      return;
    }
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

    let menuY = 140;
    const addMenuButton = (label: string, callback: () => void, iconKey: string): void => {
      new UIButton(this, 1160, menuY, label, callback, 156, 50, { iconKey, iconSize: 30 }).setDepth(830);
      menuY += 62;
    };

    addMenuButton("写信", () => this.scene.start("LetterScene"), AssetKeys.UI.IconLetter);
    if (save.dayCount >= 6) {
      addMenuButton("收藏", () => this.scene.start("CollectionScene"), AssetKeys.UI.IconCollection);
    }
    if (save.growthStage === GrowthStage.AdultPet && save.adultFormGenerated) {
      addMenuButton("换装", () => this.scene.start("WardrobeScene"), AssetKeys.UI.IconWardrobe);
    }
    addMenuButton("设置", () => this.scene.start("SettingsScene", { returnScene: "MainRoomScene" }), AssetKeys.UI.IconSettings);
    if (save.dayCount >= 6) {
      addMenuButton("布置", () => this.scene.start("RoomArrangeScene"), AssetKeys.UI.IconArrange);
    }
    addMenuButton("记录", () => this.scene.start("RecordBoardScene"), AssetKeys.UI.IconRecord);

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
    if (save.dayCount < 6) return { checked: false, item: null, forced: false };
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
    if (OpeningReplySystem.shouldShowFirstReply(save)) {
      const reply = OpeningReplySystem.getFirstReply(save);
      modalNotices.push({
        title: reply.title,
        body: reply.body,
        buttonText: "收好纸条",
        onClose: () => OpeningReplySystem.markFirstReplyRead(save)
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
    if (save.dayCount === 1) return "今天它还在睡觉。给它写一封信吧，明天也许会有变化。";
    if (save.dayCount === 2) return "小芽冒出来了。看看花盆旁边有没有新的纸条。";
    if (save.dayCount === 3) return "今日目标：照看这株奇怪的小芽，它好像快变成蘑菇了。";
    if (save.dayCount === 4) return "今日目标：它有了小小的样子，先安静陪它待一会儿。";
    if (save.dayCount === 5) return "今日目标：轻轻点一点它，看看它会怎么回应。";
    if (!LetterSystem.hasLetterForToday(save)) return "今日目标：写一封信，让它把今天记住。";
    if (save.growthStage === GrowthStage.AdultPet && save.adultFormGenerated) return "今日目标：陪它互动，收集小礼物，试试新的装扮。";
    return "今日目标：点一点家具，看看它喜欢在小屋里做什么。";
  }

  private drawEarlyGrowthHint(save: NonNullable<typeof this.save>, pot: Pot): void {
    if (save.dayCount !== 1) return;
    const bg = this.add.graphics().setDepth(760);
    AnimalIslandTheme.drawCard(bg, pot.x - 220, pot.y - 190, 440, 76, {
      fill: AnimalIslandTheme.colors.creamSoft,
      border: AnimalIslandTheme.colors.borderLight,
      radius: 24,
      alpha: 0.9
    });
    this.add
      .text(pot.x, pot.y - 152, "今天它还在睡觉。\n给它写一封信吧，明天也许会有变化。", {
        ...AnimalIslandTheme.textStyle(18, AnimalIslandTheme.colors.bodyText),
        align: "center",
        lineSpacing: 5
      })
      .setOrigin(0.5)
      .setDepth(761);
  }

  private getPotFeedback(dayCount: number): string {
    if (dayCount === 2) return "小芽轻轻晃了一下。";
    if (dayCount === 3) return "小芽的伞盖好像鼓起来了。";
    if (dayCount >= 4) return "它正在学着醒来。";
    const feedback = [
      "土壤里安安静静的。",
      "好像有什么正在慢慢醒来。",
      "你感觉花盆变暖了一点。",
      "它还没有发芽，但似乎听见了你的声音。"
    ];
    return feedback[Phaser.Math.Between(0, feedback.length - 1)];
  }
}
