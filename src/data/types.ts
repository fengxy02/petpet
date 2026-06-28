export enum GrowthStage {
  SeedInPot = "SeedInPot",
  SproutSmall = "SproutSmall",
  SproutGrowing = "SproutGrowing",
  BabyPet = "BabyPet",
  AdultPet = "AdultPet"
}

export enum PetState {
  Idle = "Idle",
  Walking = "Walking",
  Sleeping = "Sleeping",
  Reading = "Reading",
  Exercising = "Exercising",
  Crafting = "Crafting",
  Eating = "Eating",
  Playing = "Playing",
  Thinking = "Thinking",
  Happy = "Happy",
  Question = "Question",
  Sad = "Sad",
  Resting = "Resting"
}

export enum FurnitureType {
  Bed = "Bed",
  Chair = "Chair",
  Desk = "Desk",
  ExerciseEquipment = "ExerciseEquipment",
  FoodBowl = "FoodBowl",
  Toy = "Toy",
  Pot = "Pot",
  Sofa = "Sofa",
  Bookshelf = "Bookshelf",
  Wardrobe = "Wardrobe",
  Decoration = "Decoration",
  Rug = "Rug",
  Painting = "Painting",
  CoffeeTable = "CoffeeTable",
  TvCabinet = "TvCabinet"
}

export enum ClothingSlot {
  Hat = "Hat",
  HeadAccessory = "HeadAccessory",
  NeckAccessory = "NeckAccessory",
  BodyAccessory = "BodyAccessory",
  TailAccessory = "TailAccessory"
}

export type FloorId = 1 | 2;

export type FurnitureSurface = "floor" | "wall";

export type PetSaveData = {
  mood: number;
  energy: number;
  intimacy: number;
  currentFloor: FloorId;
  x: number;
  y: number;
  currentState: PetState;
  adultFormId?: string;
};

export type PotSaveData = {
  x: number;
  y: number;
  scale: number;
  currentTextureKey: string;
};

export type FurnitureSaveData = {
  id: string;
  type: FurnitureType;
  floorId: FloorId;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  interactable: boolean;
  isPlaced: boolean;
  surface: FurnitureSurface;
  gridCellId: string;
};

export type RoomSaveData = {
  furnitureItems: FurnitureSaveData[];
};

export type LetterData = {
  day: number;
  content: string;
  createdAt: string;
  extractedTags: string[];
};

export type DailySummary = {
  sourceDay: number;
  summaryText: string;
  tags: string[];
  read: boolean;
};

export type QuestionAnswer = {
  questionId: string;
  answerId: string;
  label: string;
  tags: string[];
  day: number;
  createdAt: string;
};

export type PreferenceData = {
  tags: Record<string, number>;
  answers: QuestionAnswer[];
};

export type CollectionItemData = {
  id: string;
  type: "postcard" | "craft";
  name: string;
  description: string;
  imageKey: string;
  dayObtained: number;
  createdAt: string;
};

export type LoginProgressNotice = {
  date: string;
  crossedDays: number;
  advancedDays: number;
  message: string;
  read: boolean;
  createdAt: string;
};

export type PetInteractionRecord = {
  day: number;
  furnitureType: FurnitureType;
  action: PetState | string;
  timestamp: string;
};

export type AdultFormData = {
  formId: string;
  formName: string;
  description: string;
  personalityTags: string[];
  spriteBasePath: string;
  reason: string;
};

export type ClothingItem = {
  id: string;
  name: string;
  slot: ClothingSlot;
  imageKey: string;
  unlocked: boolean;
};

export type SaveData = {
  version: number;
  createdAt: string;
  lastLoginDate: string;
  currentDate: string;
  dayCount: number;
  seedPlanted: boolean;
  growthStage: GrowthStage;
  pet: PetSaveData;
  pot: PotSaveData;
  adultFormGenerated: boolean;
  adultFormLocked: boolean;
  rerollUsed: boolean;
  adultForm?: AdultFormData;
  lastLoginProgress?: LoginProgressNotice | null;
  letters: LetterData[];
  summaries: DailySummary[];
  preferences: PreferenceData;
  collections: CollectionItemData[];
  interactionRecords: PetInteractionRecord[];
  room: RoomSaveData;
  unlockedClothingIds: string[];
  equippedClothingBySlot: Record<string, string | null>;
};

export type QuestionOption = {
  id: string;
  label: string;
  tags: string[];
};

export type QuestionData = {
  id: string;
  text: string;
  options: QuestionOption[];
};

export type AdultFormDefinition = {
  formId: string;
  formName: string;
  description: string;
  personalityTags: string[];
  spriteBasePath: string;
  reasonTemplate: string;
  scoreTags: string[];
};

export type RandomEventDefinition = {
  id: string;
  type: "postcard" | "craft";
  name: string;
  description: string;
  imageKey: string;
};
