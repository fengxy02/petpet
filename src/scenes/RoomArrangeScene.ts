import Phaser from "phaser";
import {
  applyFurnitureCell,
  canPlaceFurnitureAtCell,
  furniturePlacementDefinitions,
  findFirstAvailableCell,
  getFixedStructureBlockedCellIds,
  getGridCell,
  getNearestGridCell,
  getOccupiedGridCellIds,
  roomGridCells,
  rotateFurniture,
  type FurnitureGridCell
} from "../data/roomLayout";
import { FurnitureSaveData, SaveData } from "../data/types";
import { Furniture } from "../entities/Furniture";
import { Pot } from "../entities/Pot";
import { Room } from "../entities/Room";
import { SaveSystem } from "../systems/SaveSystem";
import { AnimalIslandTheme } from "../ui/AnimalIslandTheme";
import { UIButton } from "../ui/UIButton";
import { furnitureLabels } from "../data/furnitureDatabase";
import { getFurnitureRotationRadians, getFurnitureTextureKey } from "../utils/AssetKeys";

type DragOrigin = {
  x: number;
  y: number;
  gridCellId: string;
  depth: number;
};

export class RoomArrangeScene extends Phaser.Scene {
  private draft?: SaveData;
  private furnitureObjects = new Map<string, Furniture>();
  private inventoryObjects: Phaser.GameObjects.Container[] = [];
  private selectionControls: Phaser.GameObjects.GameObject[] = [];
  private selectedFurniture?: Furniture;
  private dragOrigins = new Map<string, DragOrigin>();
  private gridGraphics?: Phaser.GameObjects.Graphics;
  private previewGraphics?: Phaser.GameObjects.Graphics;

  constructor() {
    super("RoomArrangeScene");
  }

  create(): void {
    const save = SaveSystem.loadSave();
    if (!save) {
      this.scene.start("StartScene");
      return;
    }
    this.draft = JSON.parse(JSON.stringify(save)) as SaveData;
    const room = new Room(this, this.draft);
    const pot = new Pot(this, this.draft.pot, this.draft.growthStage);
    pot.syncToStagePlacement(this.draft.growthStage);
    this.drawGrid();
    for (const furniture of room.furniture) {
      this.setupFurnitureDrag(furniture);
    }
    this.drawChrome();
    this.refreshInventory();
  }

  private drawChrome(): void {
    const top = this.add.graphics().setDepth(940);
    AnimalIslandTheme.drawTopStrip(top, 1280, 82);
    this.add.text(42, 26, "家具布置", AnimalIslandTheme.textStyle(28, AnimalIslandTheme.colors.text, { fontStyle: "bold" })).setDepth(941);
    new UIButton(this, 300, 44, "我要重新布置", () => this.recycleAllFurniture(), 226, 52, { variant: "default", fontSize: 18 }).setDepth(950);
    new UIButton(this, 1090, 44, "我整理好了", () => this.finishArrangement(), 200, 52, { variant: "primary", fontSize: 18 }).setDepth(950);
    const bottom = this.add.graphics().setDepth(940);
    AnimalIslandTheme.drawCard(bottom, 18, 618, 1244, 88, { fill: AnimalIslandTheme.colors.cream, border: AnimalIslandTheme.colors.borderLight, radius: 24, alpha: 0.94 });
    this.add.text(42, 638, "待摆区", AnimalIslandTheme.textStyle(22, AnimalIslandTheme.colors.text, { fontStyle: "bold" })).setDepth(941);
  }

  private drawGrid(): void {
    const fixedBlockers = new Set(getFixedStructureBlockedCellIds(this.requireDraft().growthStage));
    this.gridGraphics?.destroy();
    const g = this.add.graphics().setDepth(230);
    for (const cell of roomGridCells) {
      const blocked = cell.blocked || fixedBlockers.has(cell.id);
      g.fillStyle(blocked ? AnimalIslandTheme.colors.red : cell.surface === "floor" ? AnimalIslandTheme.colors.green : AnimalIslandTheme.colors.tealHover, blocked ? 0.16 : 0.11);
      g.fillPoints(cell.polygon, true);
      g.lineStyle(1, blocked ? AnimalIslandTheme.colors.red : cell.surface === "floor" ? AnimalIslandTheme.colors.green : AnimalIslandTheme.colors.teal, blocked ? 0.34 : 0.26);
      g.strokePoints(cell.polygon, true);
    }
    this.gridGraphics = g;
    this.previewGraphics = this.add.graphics().setDepth(910);
  }

  private setupFurnitureDrag(furniture: Furniture): void {
    this.furnitureObjects.set(furniture.item.id, furniture);
    furniture.setInteractive({ useHandCursor: true });
    this.input.setDraggable(furniture);
    furniture.on("pointerdown", () => this.selectFurniture(furniture));
    furniture.on("dragstart", () => {
      this.selectFurniture(furniture);
      this.dragOrigins.set(furniture.item.id, {
        x: furniture.x,
        y: furniture.y,
        gridCellId: furniture.item.gridCellId,
        depth: furniture.depth
      });
      furniture.setDepth(920);
    });
    furniture.on("drag", (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      furniture.setPosition(dragX, dragY);
      this.previewDropForItem(furniture.item, dragX, dragY);
      this.positionSelectionControls(furniture);
    });
    furniture.on("dragend", () => this.dropPlacedFurniture(furniture));
  }

  private dropPlacedFurniture(furniture: Furniture): void {
    this.previewGraphics?.clear();
    const draft = this.requireDraft();
    const origin = this.dragOrigins.get(furniture.item.id);
    const definition = furniturePlacementDefinitions[furniture.item.type];
    const nearest = getNearestGridCell({ x: furniture.x, y: furniture.y }, definition.surfaces);
    if (nearest && canPlaceFurnitureAtCell(furniture.item, nearest.id, draft.room.furnitureItems, draft.growthStage)) {
      applyFurnitureCell(furniture.item, nearest.id);
      furniture.syncFromItem();
      this.selectFurniture(furniture);
      return;
    }
    if (origin) {
      furniture.item.gridCellId = origin.gridCellId;
      const cell = getGridCell(origin.gridCellId);
      if (cell) applyFurnitureCell(furniture.item, cell.id);
      furniture.setDepth(origin.depth);
    }
    furniture.syncFromItem();
    this.showInvalidFeedback(furniture.x, furniture.y);
    this.selectFurniture(furniture);
  }

  private previewDropForItem(item: FurnitureSaveData, x: number, y: number): void {
    const draft = this.requireDraft();
    const definition = furniturePlacementDefinitions[item.type];
    const nearest = getNearestGridCell({ x, y }, definition.surfaces, true);
    this.previewGraphics?.clear();
    if (!nearest) return;
    const valid = canPlaceFurnitureAtCell(item, nearest.id, draft.room.furnitureItems, draft.growthStage);
    const previewItem = { ...item, gridCellId: nearest.id, surface: nearest.surface, isPlaced: true };
    const occupiedCells = getOccupiedGridCellIds(previewItem)
      .map((cellId) => getGridCell(cellId))
      .filter((cell): cell is FurnitureGridCell => Boolean(cell));
    const cellsToDraw = occupiedCells.length > 0 ? occupiedCells : [nearest];
    for (const cell of cellsToDraw) {
      this.previewGraphics?.fillStyle(valid ? AnimalIslandTheme.colors.teal : AnimalIslandTheme.colors.red, 0.28).fillPoints(cell.polygon, true);
      this.previewGraphics?.lineStyle(3, valid ? AnimalIslandTheme.colors.tealActive : AnimalIslandTheme.colors.red, 0.75).strokePoints(cell.polygon, true);
    }
  }

  private refreshInventory(): void {
    for (const object of this.inventoryObjects) object.destroy();
    this.inventoryObjects = [];
    const draft = this.requireDraft();
    const unplaced = draft.room.furnitureItems.filter((item) => item.isPlaced === false);
    unplaced.forEach((item, index) => {
      const x = 145 + index * 104;
      const y = 678;
      let wasDragged = false;
      const container = this.add.container(x, y).setDepth(960);
      const bg = this.add.graphics();
      AnimalIslandTheme.drawCard(bg, -42, -38, 84, 76, { fill: AnimalIslandTheme.colors.creamSoft, border: AnimalIslandTheme.colors.borderLight, radius: 16 });
      const sprite = this.add.sprite(0, -6, getFurnitureTextureKey(item.type)).setScale(0.46).setRotation(getFurnitureRotationRadians(item.rotation));
      const label = this.add.text(0, 25, furnitureLabels[item.type], AnimalIslandTheme.textStyle(13, AnimalIslandTheme.colors.text, { fontStyle: "bold" })).setOrigin(0.5);
      container.add([bg, sprite, label]);
      container.setSize(84, 76).setInteractive({ useHandCursor: true });
      this.input.setDraggable(container);
      container.on("pointerup", () => {
        if (wasDragged) return;
        this.placeStoredFurnitureInFirstAvailableCell(item);
      });
      container.on("dragstart", () => {
        wasDragged = false;
      });
      container.on("drag", (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        wasDragged = true;
        container.setPosition(dragX, dragY);
        this.previewDropForItem(item, dragX, dragY);
      });
      container.on("dragend", () => {
        this.previewGraphics?.clear();
        const definition = furniturePlacementDefinitions[item.type];
        const nearest = getNearestGridCell({ x: container.x, y: container.y }, definition.surfaces);
        if (nearest && canPlaceFurnitureAtCell(item, nearest.id, draft.room.furnitureItems, draft.growthStage)) {
          this.placeStoredFurnitureAtCell(item, nearest.id);
        } else {
          this.showInvalidFeedback(container.x, container.y);
          this.refreshInventory();
        }
        this.time.delayedCall(0, () => {
          wasDragged = false;
        });
      });
      this.inventoryObjects.push(container);
    });
  }

  private placeStoredFurnitureInFirstAvailableCell(item: FurnitureSaveData): void {
    const draft = this.requireDraft();
    const cell = findFirstAvailableCell(item, draft.room.furnitureItems, draft.growthStage);
    if (!cell) {
      this.showInvalidFeedback(640, 600);
      return;
    }
    this.placeStoredFurnitureAtCell(item, cell.id);
  }

  private placeStoredFurnitureAtCell(item: FurnitureSaveData, gridCellId: string): void {
    applyFurnitureCell(item, gridCellId);
    const furniture = new Furniture(this, item);
    this.setupFurnitureDrag(furniture);
    this.selectFurniture(furniture);
    this.refreshInventory();
  }

  private selectFurniture(furniture: Furniture): void {
    this.selectedFurniture = furniture;
    this.clearSelectionControls();
    const recycle = new UIButton(this, 0, 0, "回收", () => this.recycleSelectedFurniture(), 82, 42, { variant: "danger", fontSize: 15 }).setDepth(970);
    const rotateLeft = new UIButton(this, 0, 0, "左旋", () => this.rotateSelectedFurniture(-1), 82, 42, { variant: "default", fontSize: 15 }).setDepth(970);
    const rotateRight = new UIButton(this, 0, 0, "右旋", () => this.rotateSelectedFurniture(1), 82, 42, { variant: "default", fontSize: 15 }).setDepth(970);
    this.selectionControls.push(recycle, rotateLeft, rotateRight);
    this.positionSelectionControls(furniture);
  }

  private positionSelectionControls(furniture: Furniture): void {
    if (this.selectionControls.length === 0) return;
    const baseX = Phaser.Math.Clamp(furniture.x, 170, 1110);
    const baseY = Phaser.Math.Clamp(furniture.y - 110, 112, 570);
    const offsets = [-92, 0, 92];
    this.selectionControls.forEach((control, index) => {
      (control as Phaser.GameObjects.Container).setPosition(baseX + offsets[index], baseY);
    });
  }

  private clearSelectionControls(): void {
    for (const control of this.selectionControls) control.destroy();
    this.selectionControls = [];
  }

  private recycleSelectedFurniture(): void {
    if (!this.selectedFurniture) return;
    const item = this.selectedFurniture.item;
    item.isPlaced = false;
    item.gridCellId = "";
    item.x = -1000;
    item.y = -1000;
    this.selectedFurniture.destroy();
    this.furnitureObjects.delete(item.id);
    this.selectedFurniture = undefined;
    this.clearSelectionControls();
    this.refreshInventory();
  }

  private rotateSelectedFurniture(direction: -1 | 1): void {
    if (!this.selectedFurniture) return;
    rotateFurniture(this.selectedFurniture.item, direction);
    this.selectedFurniture.syncFromItem();
    this.positionSelectionControls(this.selectedFurniture);
  }

  private recycleAllFurniture(): void {
    const draft = this.requireDraft();
    for (const item of draft.room.furnitureItems) {
      item.isPlaced = false;
      item.gridCellId = "";
      item.x = -1000;
      item.y = -1000;
    }
    for (const furniture of this.furnitureObjects.values()) furniture.destroy();
    this.furnitureObjects.clear();
    this.selectedFurniture = undefined;
    this.clearSelectionControls();
    this.refreshInventory();
  }

  private finishArrangement(): void {
    const draft = this.requireDraft();
    SaveSystem.saveGame(draft);
    this.scene.start("MainRoomScene");
  }

  private showInvalidFeedback(x: number, y: number): void {
    const flash = this.add.circle(x, y, 42, AnimalIslandTheme.colors.red, 0.28).setDepth(980);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scaleX: 1.6,
      scaleY: 1.6,
      duration: 420,
      ease: "Sine.easeOut",
      onComplete: () => flash.destroy()
    });
  }

  private requireDraft(): SaveData {
    if (!this.draft) throw new Error("RoomArrangeScene requires a save draft.");
    return this.draft;
  }
}
