import Phaser from "phaser";
import { clothingDatabase } from "../data/clothingDatabase";
import { ClothingSlot, FloorId, FurnitureType, GrowthStage, PetSaveData, PetState, SaveData } from "../data/types";
import { GameEvents } from "../game/GameEvents";
import { MushroomAnimationKeys, MushroomFrames } from "../utils/AssetKeys";
import { DepthSorter } from "../utils/DepthSorter";
import { weightedPick } from "../utils/MathUtils";
import { Furniture } from "./Furniture";
import { FloatingText } from "./FloatingText";
import { Room } from "./Room";

const BABY_HIT_AREA = new Phaser.Geom.Rectangle(-65, -138, 130, 138);
const ADULT_HIT_AREA = new Phaser.Geom.Rectangle(-110, -238, 220, 238);
const BABY_SPRITE_SCALE = 0.62;
const ADULT_SPRITE_SCALE = 1;
const WALK_MIN_DURATION_MS = 650;
const WALK_DURATION_MS_PER_PIXEL = 7.2;

export class Pet extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;
  private shadow?: Phaser.GameObjects.Ellipse;
  private save: PetSaveData;
  private fullSave: SaveData;
  private room: Room;
  private busyUntil = 0;
  private nextAutonomyAt = 0;
  private clothingSprites: Phaser.GameObjects.Sprite[] = [];
  private clickBounceToken = 0;
  private poseTween?: Phaser.Tweens.Tween;
  private lastAutonomyAction?: string;

  constructor(scene: Phaser.Scene, save: SaveData, room: Room) {
    super(scene, save.pet.x, save.pet.y);
    this.save = save.pet;
    this.fullSave = save;
    this.room = room;
    if (this.isAdult()) {
      const shadow = scene.add.ellipse(0, -7, 120, 22, 0x6f604e, 0.18).setOrigin(0.5);
      this.shadow = shadow;
      this.add(shadow);
    }
    const texture = MushroomFrames.idle[0];
    this.sprite = scene.add.sprite(0, 0, texture).setOrigin(0.5, 1).setScale(this.baseSpriteScale());
    this.add(this.sprite);
    if (this.isAdult()) this.applyClothing();
    scene.add.existing(this);
    DepthSorter.applyByY(this);
    this.applyPetState(PetState.Idle);
    this.configurePointer();
    this.nextAutonomyAt = scene.time.now + 2200;
  }

  update(time: number): void {
    DepthSorter.applyByY(this);
    if (time < this.nextAutonomyAt || time < this.busyUntil) return;
    this.nextAutonomyAt = time + Phaser.Math.Between(4500, 8500);
    this.performAutonomy();
  }

  moveToFurniture(furniture: Furniture): void {
    if (furniture.furnitureType === FurnitureType.Wardrobe) return;
    const state = this.stateForFurniture(furniture.furnitureType);
    const points = this.pathTo(furniture.floorId, furniture.interactionPoint.x, furniture.interactionPoint.y);
    this.followPath(points, () => {
      this.applyPetState(state);
      this.busyUntil = this.scene.time.now + Phaser.Math.Between(2600, 4600);
      const tuning = this.interactionTuningForFurniture(furniture.furnitureType);
      this.fullSave.pet.energy = Phaser.Math.Clamp(this.fullSave.pet.energy + tuning.energy, 0, 100);
      this.fullSave.pet.mood = Phaser.Math.Clamp(this.fullSave.pet.mood + tuning.mood, 0, 100);
      this.fullSave.pet.intimacy = Phaser.Math.Clamp(this.fullSave.pet.intimacy + tuning.intimacy, 0, 100);
      FloatingText.show(this.scene, this.x, this.y - 150, tuning.feedback);
      this.playFurnitureFeedback(state);
      this.scene.events.emit(GameEvents.PetInteraction, furniture.item, state);
    });
  }

  guideTo(x: number, y: number, floor: FloorId, finalState = PetState.Idle, action = "Wander"): void {
    const points = this.pathTo(floor, x, y);
    this.followPath(points, () => {
      this.applyPetState(finalState);
      this.scene.events.emit(GameEvents.PetInteraction, { type: FurnitureType.Decoration }, action);
    });
  }

  applyClothing(): void {
    for (const sprite of this.clothingSprites) sprite.destroy();
    this.clothingSprites = [];
    for (const id of Object.values(this.fullSave.equippedClothingBySlot)) {
      const item = clothingDatabase.find((candidate) => candidate.id === id);
      if (!item) continue;
      const offset = this.offsetForSlot(item.slot);
      const sprite = this.scene.add.sprite(offset.x, offset.y, item.imageKey).setOrigin(0.5).setScale(0.85);
      this.add(sprite);
      this.clothingSprites.push(sprite);
    }
  }

  private performAutonomy(): void {
    const chosen = this.chooseAutonomyAction();
    if (chosen === "IdleMotion") {
      this.playIdleMicroMotion();
      return;
    }
    if (chosen === "Wander") {
      const point = this.room.getRandomPointOnFloor();
      this.guideTo(point.x, point.y, 1, PetState.Idle, "Wander");
      return;
    }
    if (chosen === "Think") {
      this.guideTo(this.room.quietPoint.x, this.room.quietPoint.y, 1, PetState.Thinking, "Think");
      return;
    }
    const furniture = this.findFurnitureForAction(chosen);
    if (furniture) this.moveToFurniture(furniture);
  }

  private chooseAutonomyAction(): string {
    const weights = this.getAutonomyWeights().map((item) => {
      if (item.action !== this.lastAutonomyAction) return item;
      return { ...item, weight: Math.max(1, item.weight * 0.35) };
    });
    const chosen = weightedPick(weights).action;
    this.lastAutonomyAction = chosen;
    return chosen;
  }

  private getAutonomyWeights(): Array<{ action: string; weight: number }> {
    const tags = this.fullSave.adultForm?.personalityTags ?? [];
    return [
      { action: "Wander", weight: 5 + (tags.includes("travel") ? 3 : 0) },
      { action: "Sleep", weight: 2 + (tags.includes("sleep") || tags.includes("rest") ? 5 : 0) },
      { action: "Read", weight: 2 + (tags.includes("read") ? 5 : 0) },
      { action: "Exercise", weight: 1 + (tags.includes("exercise") || tags.includes("active") ? 5 : 0) },
      { action: "Think", weight: 3 + (tags.includes("quiet") ? 2 : 0) },
      { action: "Play", weight: 2 + (tags.includes("happy") ? 2 : 0) },
      { action: "Eat", weight: 2 },
      { action: "Rest", weight: 2 + (tags.includes("comfort") ? 3 : 0) },
      { action: "Craft", weight: 1 + (tags.includes("craft") ? 6 : 0) },
      { action: "IdleMotion", weight: this.isAdult() ? 3 : 0 }
    ].filter((item) => item.weight > 0);
  }

  private findFurnitureForAction(action: string): Furniture | undefined {
    const typeMap: Record<string, FurnitureType[]> = {
      Sleep: [FurnitureType.Bed],
      Read: [FurnitureType.Chair, FurnitureType.Bookshelf],
      Exercise: [FurnitureType.ExerciseEquipment],
      Play: [FurnitureType.Toy],
      Eat: [FurnitureType.FoodBowl],
      Rest: [FurnitureType.Sofa],
      Craft: [FurnitureType.Desk]
    };
    const types = typeMap[action] ?? [];
    return this.room.furniture.find((furniture) => types.includes(furniture.furnitureType));
  }

  private pathTo(_targetFloor: FloorId, x: number, y: number): Phaser.Math.Vector2[] {
    const points: Phaser.Math.Vector2[] = [];
    this.save.currentFloor = 1;
    points.push(new Phaser.Math.Vector2(x, y));
    return points;
  }

  private followPath(points: Phaser.Math.Vector2[], onComplete: () => void): void {
    if (points.length === 0) {
      onComplete();
      return;
    }
    const [next, ...rest] = points;
    this.faceTarget(next.x);
    this.applyPetState(PetState.Walking);
    const distance = Phaser.Math.Distance.Between(this.x, this.y, next.x, next.y);
    this.scene.tweens.add({
      targets: this,
      x: next.x,
      y: next.y,
      duration: Math.max(WALK_MIN_DURATION_MS, distance * WALK_DURATION_MS_PER_PIXEL),
      ease: "Sine.easeInOut",
      onUpdate: () => {
        this.save.x = this.x;
        this.save.y = this.y;
        DepthSorter.applyByY(this);
      },
      onComplete: () => {
        this.save.x = this.x;
        this.save.y = this.y;
        this.followPath(rest, onComplete);
      }
    });
  }

  private faceTarget(targetX: number): void {
    if (Math.abs(targetX - this.x) <= 4) return;
    this.sprite.setFlipX(targetX < this.x);
  }

  private applyPetState(state: PetState): void {
    this.save.currentState = state;
    this.stopPoseTweens();
    const animationKey = this.animationForState(state);
    if (animationKey) {
      this.sprite.play(animationKey, true);
      this.shadow?.setScale(state === PetState.Walking ? 1.04 : 1, 1);
      return;
    }
    this.sprite.stop();
    this.sprite.setTexture(this.textureForState(state));
  }

  private animationForState(state: PetState): string | undefined {
    switch (state) {
      case PetState.Idle:
        return MushroomAnimationKeys.Idle;
      case PetState.Walking:
      case PetState.Exercising:
        return MushroomAnimationKeys.Walk;
      case PetState.Sleeping:
        return MushroomAnimationKeys.Sleep;
      case PetState.Reading:
      case PetState.Resting:
        return MushroomAnimationKeys.Relax;
      case PetState.Crafting:
        return MushroomAnimationKeys.Craft;
      case PetState.Eating:
      case PetState.Playing:
      case PetState.Thinking:
      case PetState.Happy:
      case PetState.Question:
        return MushroomAnimationKeys.React;
      default:
        return undefined;
    }
  }

  private textureForState(state: PetState): string {
    switch (state) {
      case PetState.Sad:
        return MushroomFrames.relax[3];
      default:
        return MushroomFrames.idle[0];
    }
  }

  private configurePointer(): void {
    this.setInteractive({
      hitArea: this.isAdult() ? ADULT_HIT_AREA : BABY_HIT_AREA,
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true
    });
    this.on("pointerdown", () => this.playClickBounce());
  }

  private playClickBounce(): void {
    const stateBeforeClick = this.save.currentState;
    const token = ++this.clickBounceToken;
    this.stopPoseTweens();
    this.sprite.stop();
    this.resetSpriteTransform();
    this.sprite.play(MushroomAnimationKeys.React, true);
    if (this.isAdult()) this.emitSparkles();
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: { from: this.baseSpriteScale() * 1.08, to: this.baseSpriteScale() },
      scaleY: { from: this.baseSpriteScale() * 0.88, to: this.baseSpriteScale() },
      y: { from: 8, to: 0 },
      angle: { from: -4, to: 0 },
      duration: 260,
      ease: "Back.easeOut"
    });
    this.scene.time.delayedCall(520, () => {
      if (token !== this.clickBounceToken) return;
      this.sprite.stop();
      this.resetSpriteTransform();
      this.applyPetState(stateBeforeClick);
    });
  }

  private playIdleMicroMotion(): void {
    this.busyUntil = this.scene.time.now + 900;
    this.scene.tweens.add({
      targets: this.sprite,
      angle: { from: -2, to: 2 },
      y: { from: 0, to: -5 },
      duration: 360,
      yoyo: true,
      ease: "Sine.easeInOut",
      onComplete: () => this.applyPetState(this.save.currentState)
    });
  }

  private playFurnitureFeedback(state: PetState): void {
    this.emitSparkles(state === PetState.Sleeping ? 0.35 : 0.62);
    if (state === PetState.Playing || state === PetState.Exercising) {
      this.scene.tweens.add({
        targets: this.sprite,
        y: { from: 0, to: -8 },
        scaleX: { from: this.baseSpriteScale(), to: this.baseSpriteScale() * 1.03 },
        scaleY: { from: this.baseSpriteScale(), to: this.baseSpriteScale() * 0.97 },
        duration: 240,
        yoyo: true,
        repeat: 1,
        ease: "Sine.easeInOut"
      });
    }
  }

  private stopPoseTweens(): void {
    this.poseTween?.stop();
    this.poseTween = undefined;
    this.scene.tweens.killTweensOf(this.sprite);
    this.resetSpriteTransform();
  }

  private resetSpriteTransform(): void {
    this.sprite.setPosition(0, 0).setScale(this.baseSpriteScale()).setAngle(0);
    this.shadow?.setScale(1, 1);
  }

  private baseSpriteScale(): number {
    return this.isAdult() ? ADULT_SPRITE_SCALE : BABY_SPRITE_SCALE;
  }

  private emitSparkles(alpha = 0.68): void {
    const sparkles = this.scene.add.graphics().setPosition(this.x, this.y - 132).setDepth(this.depth + 2).setAlpha(alpha);
    sparkles.fillStyle(0xf5c76f, 1);
    sparkles.fillCircle(-34, -8, 4);
    sparkles.fillCircle(38, -20, 3);
    sparkles.fillStyle(0x8bdcc8, 0.95);
    sparkles.fillPoints(
      [
        { x: 0, y: -18 },
        { x: 7, y: -6 },
        { x: 0, y: 6 },
        { x: -7, y: -6 }
      ],
      true
    );
    this.scene.tweens.add({
      targets: sparkles,
      y: sparkles.y - 20,
      alpha: 0,
      duration: 560,
      ease: "Sine.easeOut",
      onComplete: () => sparkles.destroy()
    });
  }

  private stateForFurniture(type: FurnitureType): PetState {
    switch (type) {
      case FurnitureType.Bed:
        return PetState.Sleeping;
      case FurnitureType.Chair:
      case FurnitureType.Bookshelf:
        return PetState.Reading;
      case FurnitureType.Desk:
        return PetState.Crafting;
      case FurnitureType.ExerciseEquipment:
        return PetState.Exercising;
      case FurnitureType.FoodBowl:
        return PetState.Eating;
      case FurnitureType.Toy:
        return PetState.Playing;
      case FurnitureType.Pot:
        return PetState.Thinking;
      case FurnitureType.Sofa:
        return PetState.Resting;
      default:
        return PetState.Idle;
    }
  }

  private interactionTuningForFurniture(type: FurnitureType): { mood: number; energy: number; intimacy: number; feedback: string } {
    switch (type) {
      case FurnitureType.Bed:
      case FurnitureType.Sofa:
        return { mood: 3, energy: 8, intimacy: 1, feedback: "休息了一会儿" };
      case FurnitureType.FoodBowl:
        return { mood: 3, energy: 5, intimacy: 2, feedback: "吃得很满足" };
      case FurnitureType.Toy:
        return { mood: 7, energy: -4, intimacy: 3, feedback: "玩得很开心" };
      case FurnitureType.ExerciseEquipment:
        return { mood: 4, energy: -8, intimacy: 3, feedback: "活动了身体" };
      case FurnitureType.Chair:
      case FurnitureType.Bookshelf:
        return { mood: 3, energy: -2, intimacy: 4, feedback: "安静读了一会儿" };
      case FurnitureType.Desk:
        return { mood: 4, energy: -3, intimacy: 4, feedback: "做了点小东西" };
      case FurnitureType.Pot:
        return { mood: 2, energy: -1, intimacy: 3, feedback: "想起了最初的种子" };
      default:
        return { mood: 2, energy: -2, intimacy: 2, feedback: "记住了这次互动" };
    }
  }

  private offsetForSlot(slot: ClothingSlot): Phaser.Math.Vector2 {
    switch (slot) {
      case ClothingSlot.Hat:
        return new Phaser.Math.Vector2(0, -188);
      case ClothingSlot.HeadAccessory:
        return new Phaser.Math.Vector2(58, -158);
      case ClothingSlot.NeckAccessory:
        return new Phaser.Math.Vector2(0, -86);
      case ClothingSlot.BodyAccessory:
        return new Phaser.Math.Vector2(48, -68);
      case ClothingSlot.TailAccessory:
        return new Phaser.Math.Vector2(-72, -68);
      default:
        return new Phaser.Math.Vector2(0, 0);
    }
  }

  private isAdult(): boolean {
    return this.fullSave.growthStage === GrowthStage.AdultPet;
  }
}
