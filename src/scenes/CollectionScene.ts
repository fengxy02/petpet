import Phaser from "phaser";
import { eventDatabase } from "../data/eventDatabase";
import { CollectionSystem } from "../systems/CollectionSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { UIPanel } from "../ui/UIPanel";

const ITEMS_PER_PAGE = 6;

type CollectionSceneData = {
  page?: number;
};

export class CollectionScene extends Phaser.Scene {
  private page = 0;

  constructor() {
    super("CollectionScene");
  }

  init(data: CollectionSceneData = {}): void {
    this.page = data.page ?? 0;
  }

  create(): void {
    const save = SaveSystem.loadSave();
    if (!save) {
      this.scene.start("StartScene");
      return;
    }
    AnimalIslandTheme.sceneBackground(this);
    new UIPanel(this, 640, 360, 980, 600, "收藏");
    const items = CollectionSystem.getCollections(save);
    const maxPage = Math.max(0, Math.ceil(items.length / ITEMS_PER_PAGE) - 1);
    this.page = Phaser.Math.Clamp(this.page, 0, maxPage);
    const uniqueCollected = new Set(items.map((item) => item.id.split("_day_")[0])).size;
    this.add.text(640, 112, `收藏进度 ${uniqueCollected}/${eventDatabase.length} · 共 ${items.length} 件`, {
      ...AnimalIslandTheme.textStyle(19, AnimalIslandTheme.colors.mutedText)
    }).setOrigin(0.5);
    if (items.length === 0) {
      this.add.text(640, 360, "还没有收藏。等它长大一点，也许会带回小东西。", {
        ...AnimalIslandTheme.textStyle(24, AnimalIslandTheme.colors.bodyText)
      }).setOrigin(0.5);
    }
    items.slice(this.page * ITEMS_PER_PAGE, this.page * ITEMS_PER_PAGE + ITEMS_PER_PAGE).forEach((item, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 360 + col * 280;
      const y = 248 + row * 202;
      const card = this.add.graphics();
      AnimalIslandTheme.drawCard(card, x - 116, y - 82, 232, 184, { fill: AnimalIslandTheme.colors.creamSoft, border: AnimalIslandTheme.colors.borderLight, radius: 22 });
      this.add.image(x, y - 28, item.imageKey).setDisplaySize(68, 68);
      this.add.text(x, y + 28, item.name, AnimalIslandTheme.textStyle(20, AnimalIslandTheme.colors.text, { fontStyle: "bold" })).setOrigin(0.5);
      this.add.text(x, y + 54, `Day ${item.dayObtained}`, AnimalIslandTheme.textStyle(16, AnimalIslandTheme.colors.mutedText)).setOrigin(0.5);
      this.add.text(x, y + 84, item.description, {
        ...AnimalIslandTheme.textStyle(15, AnimalIslandTheme.colors.bodyText),
        wordWrap: { width: 210 },
        align: "center"
      }).setOrigin(0.5);
    });
    if (items.length > ITEMS_PER_PAGE) {
      new UIButton(this, 500, 580, "上一页", () => this.scene.restart({ page: Math.max(0, this.page - 1) }), 150, 50, {
        variant: "default",
        fontSize: 18
      }).setEnabled(this.page > 0);
      this.add.text(640, 580, `${this.page + 1}/${maxPage + 1}`, AnimalIslandTheme.textStyle(18, AnimalIslandTheme.colors.mutedText)).setOrigin(0.5);
      new UIButton(this, 780, 580, "下一页", () => this.scene.restart({ page: Math.min(maxPage, this.page + 1) }), 150, 50, {
        variant: "default",
        fontSize: 18
      }).setEnabled(this.page < maxPage);
    }
    new UIButton(this, 640, 635, "回到小屋", () => this.scene.start("MainRoomScene"), 220, 58, { variant: "primary" });
  }
}
