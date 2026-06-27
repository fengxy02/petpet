import { FurnitureType } from "../data/types";

export type AssetManifestItem = {
  key: string;
  path: string;
  kind: "cover" | "button" | "room" | "growth" | "baby" | "adult" | "furniture" | "collection" | "clothing" | "ui";
  width?: number;
  height?: number;
};

export const AssetKeys = {
  Start: {
    CoverBackground: "start_cover_background",
    GameLogo: "start_game_logo",
    StartButton: "start_button",
    ContinueButton: "continue_button",
    SettingsButton: "settings_button"
  },
  Room: {
    CosyBackground: "room_cosy_background",
    Background: "room_background",
    ShellBase: "room_shell_base",
    Floor1: "room_floor_1",
    Floor2: "room_floor_2",
    BackWall: "room_back_wall",
    LeftWall: "room_left_wall",
    RightWall: "room_right_wall",
    Balcony: "room_balcony",
    Window: "room_window",
    Stairs: "room_stairs",
    Railing: "room_railing",
    LightShadow: "room_light_shadow"
  },
  Growth: {
    PotEmpty: "growth_pot_empty",
    PotSoil: "growth_pot_soil",
    PotSproutSmall: "growth_pot_sprout_small",
    PotSproutGrowing: "growth_pot_sprout_growing",
    Seed: "growth_seed"
  },
  Pet: {
    BabyIdle0: "pet_baby_idle_0",
    BabyIdle1: "pet_baby_idle_1",
    BabyClickSquash: "pet_baby_click_squash",
    BabyClickStretch: "pet_baby_click_stretch",
    BabyClickTilt: "pet_baby_click_tilt",
    BabyWalk0: "pet_baby_walk_0",
    BabyWalk1: "pet_baby_walk_1",
    BabyWalk2: "pet_baby_walk_2",
    BabyHappy0: "pet_baby_happy_0",
    BabyQuestion0: "pet_baby_question_0",
    BabySad0: "pet_baby_sad_0",
    BabySleep0: "pet_baby_sleep_0",
    BabyRead0: "pet_baby_read_0",
    BabyExercise0: "pet_baby_exercise_0",
    BabyCraft0: "pet_baby_craft_0",
    Adult: {
      IanIdle0: "pet_adult_ian_idle_0",
      IanSit0: "pet_adult_ian_sit_0",
      IanSleep0: "pet_adult_ian_sleep_0",
      IanPlay0: "pet_adult_ian_play_0",
      IanClick0: "pet_adult_ian_click_0",
      IanClick1: "pet_adult_ian_click_1",
      IanWalk0: "pet_adult_ian_walk_0",
      IanWalk1: "pet_adult_ian_walk_1",
      IanWalk2: "pet_adult_ian_walk_2",
      IanWalk3: "pet_adult_ian_walk_3",
      IanWalk4: "pet_adult_ian_walk_4",
      QuietReaderIdle0: "pet_adult_quiet_reader_idle_0",
      QuietReaderWalk0: "pet_adult_quiet_reader_walk_0",
      ActiveSportIdle0: "pet_adult_active_sport_idle_0",
      ActiveSportWalk0: "pet_adult_active_sport_walk_0",
      CraftMakerIdle0: "pet_adult_craft_maker_idle_0",
      CraftMakerWalk0: "pet_adult_craft_maker_walk_0",
      TravelExplorerIdle0: "pet_adult_travel_explorer_idle_0",
      TravelExplorerWalk0: "pet_adult_travel_explorer_walk_0",
      SleepySoftIdle0: "pet_adult_sleepy_soft_idle_0",
      SleepySoftWalk0: "pet_adult_sleepy_soft_walk_0",
      HealingCompanionIdle0: "pet_adult_healing_companion_idle_0",
      HealingCompanionWalk0: "pet_adult_healing_companion_walk_0"
    }
  },
  Furniture: {
    Bed: "furniture_bed",
    Chair: "furniture_chair",
    Desk: "furniture_desk",
    ExerciseEquipment: "furniture_exercise_equipment",
    FoodBowl: "furniture_food_bowl",
    Toy: "furniture_toy",
    Sofa: "furniture_sofa",
    Bookshelf: "furniture_bookshelf",
    Wardrobe: "furniture_wardrobe",
    Decoration: "furniture_decoration"
  },
  Collection: {
    Postcard001: "collection_postcard_001",
    Postcard002: "collection_postcard_002",
    Postcard003: "collection_postcard_003",
    Craft001: "collection_craft_001",
    Craft002: "collection_craft_002",
    Craft003: "collection_craft_003"
  },
  Clothing: {
    HatSmallCap: "clothing_hat_small_cap",
    HeadStar: "clothing_head_star",
    NeckSoftScarf: "clothing_neck_soft_scarf",
    BodyTinyBag: "clothing_body_tiny_bag",
    TailBow: "clothing_tail_bow"
  },
  UI: {
    Panel: "ui_panel",
    Button: "ui_button",
    ButtonPressed: "ui_button_pressed",
    IconLetter: "ui_icon_letter",
    IconCollection: "ui_icon_collection",
    IconWardrobe: "ui_icon_wardrobe",
    IconSettings: "ui_icon_settings",
    IconArrange: "ui_icon_arrange",
    IconMap: "ui_icon_map",
    IconShopping: "ui_icon_shopping",
    IconDiy: "ui_icon_diy",
    IconLeaf: "ui_icon_leaf",
    DividerBrown: "ui_divider_brown",
    DividerYellow: "ui_divider_yellow",
    WaveYellow: "ui_wave_yellow"
  }
} as const;

const MUSHROOM_FRAME_WIDTH = 220;
const MUSHROOM_FRAME_HEIGHT = 240;

function makeMushroomFrameKeys(group: string, count: number): string[] {
  return Array.from({ length: count }, (_, index) => `pet_mushroom_${group}_${index}`);
}

export const MushroomFrames = {
  idle: makeMushroomFrameKeys("idle", 4),
  walk: makeMushroomFrameKeys("walk", 6),
  react: makeMushroomFrameKeys("react", 4),
  relax: makeMushroomFrameKeys("relax", 4),
  sleep: makeMushroomFrameKeys("sleep", 7),
  craft: makeMushroomFrameKeys("craft", 4)
} as const;

export const MushroomAnimationKeys = {
  Idle: "mushroom_idle",
  Walk: "mushroom_walk",
  React: "mushroom_react",
  Relax: "mushroom_relax",
  Sleep: "mushroom_sleep",
  Craft: "mushroom_craft"
} as const;

function createMushroomManifest(group: keyof typeof MushroomFrames): AssetManifestItem[] {
  return MushroomFrames[group].map((key, index) => ({
    key,
    path: `/assets/pet/mushroom/${group}_${index}.png`,
    kind: "baby" as const,
    width: MUSHROOM_FRAME_WIDTH,
    height: MUSHROOM_FRAME_HEIGHT
  }));
}

export const AssetManifest: AssetManifestItem[] = [
  { key: AssetKeys.Start.CoverBackground, path: "/assets/room/cosy_room_background.png", kind: "cover", width: 1280, height: 720 },
  { key: AssetKeys.Start.GameLogo, path: "/assets/start/game_logo.png", kind: "ui", width: 572, height: 301 },
  { key: AssetKeys.Start.StartButton, path: "/assets/start/start_button.png", kind: "button", width: 720, height: 240 },
  { key: AssetKeys.Start.ContinueButton, path: "/assets/start/continue_button.png", kind: "button", width: 260, height: 72 },
  { key: AssetKeys.Start.SettingsButton, path: "/assets/start/settings_button.png", kind: "button", width: 720, height: 240 },
  { key: AssetKeys.Room.CosyBackground, path: "/assets/room/cosy_room_background.png", kind: "room", width: 1280, height: 720 },
  { key: AssetKeys.Room.Background, path: "/assets/room/room_background.png", kind: "room", width: 1280, height: 720 },
  { key: AssetKeys.Room.ShellBase, path: "/assets/room/room_shell_base.png", kind: "room", width: 1280, height: 720 },
  { key: AssetKeys.Room.Floor1, path: "/assets/room/floor_1.png", kind: "room", width: 840, height: 210 },
  { key: AssetKeys.Room.Floor2, path: "/assets/room/floor_2.png", kind: "room", width: 680, height: 160 },
  { key: AssetKeys.Room.BackWall, path: "/assets/room/back_wall.png", kind: "room" },
  { key: AssetKeys.Room.LeftWall, path: "/assets/room/left_wall.png", kind: "room" },
  { key: AssetKeys.Room.RightWall, path: "/assets/room/right_wall.png", kind: "room" },
  { key: AssetKeys.Room.Balcony, path: "/assets/room/balcony.png", kind: "room", width: 220, height: 120 },
  { key: AssetKeys.Room.Window, path: "/assets/room/window.png", kind: "room", width: 300, height: 230 },
  { key: AssetKeys.Room.Stairs, path: "/assets/room/stairs.png", kind: "room", width: 180, height: 210 },
  { key: AssetKeys.Room.Railing, path: "/assets/room/railing.png", kind: "room" },
  { key: AssetKeys.Room.LightShadow, path: "/assets/room/light_shadow.png", kind: "room" },
  { key: AssetKeys.Growth.PotEmpty, path: "/assets/growth/pot_empty.png", kind: "growth", width: 96, height: 110 },
  { key: AssetKeys.Growth.PotSoil, path: "/assets/growth/pot_soil_mushroom.png", kind: "growth", width: 96, height: 110 },
  { key: AssetKeys.Growth.PotSproutSmall, path: "/assets/growth/pot_sprout_small.png", kind: "growth", width: 96, height: 126 },
  { key: AssetKeys.Growth.PotSproutGrowing, path: "/assets/growth/pot_sprout_growing.png", kind: "growth", width: 96, height: 140 },
  { key: AssetKeys.Growth.Seed, path: "/assets/animal-island-ui/icons/icon-leaf.png", kind: "growth", width: 42, height: 42 },
  ...createMushroomManifest("idle"),
  ...createMushroomManifest("walk"),
  ...createMushroomManifest("react"),
  ...createMushroomManifest("relax"),
  ...createMushroomManifest("sleep"),
  ...createMushroomManifest("craft"),
  { key: AssetKeys.Pet.BabyIdle0, path: "/assets/pet/mushroom/idle_0.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyIdle1, path: "/assets/pet/mushroom/idle_1.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyClickSquash, path: "/assets/pet/mushroom/react_0.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyClickStretch, path: "/assets/pet/mushroom/react_1.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyClickTilt, path: "/assets/pet/mushroom/react_2.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyWalk0, path: "/assets/pet/mushroom/walk_0.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyWalk1, path: "/assets/pet/mushroom/walk_1.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyWalk2, path: "/assets/pet/mushroom/walk_2.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyHappy0, path: "/assets/pet/mushroom/react_3.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyQuestion0, path: "/assets/pet/mushroom/idle_2.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabySad0, path: "/assets/pet/mushroom/relax_3.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabySleep0, path: "/assets/pet/mushroom/sleep_0.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyRead0, path: "/assets/pet/mushroom/relax_0.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyExercise0, path: "/assets/pet/mushroom/walk_3.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyCraft0, path: "/assets/pet/mushroom/craft_0.png", kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanIdle0, path: "/assets/pet/mushroom/idle_0.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanSit0, path: "/assets/pet/mushroom/relax_0.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanSleep0, path: "/assets/pet/mushroom/sleep_0.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanPlay0, path: "/assets/pet/mushroom/react_3.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanClick0, path: "/assets/pet/mushroom/react_0.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanClick1, path: "/assets/pet/mushroom/react_1.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanWalk0, path: "/assets/pet/mushroom/walk_0.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanWalk1, path: "/assets/pet/mushroom/walk_1.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanWalk2, path: "/assets/pet/mushroom/walk_2.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanWalk3, path: "/assets/pet/mushroom/walk_3.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanWalk4, path: "/assets/pet/mushroom/walk_4.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.QuietReaderIdle0, path: "/assets/pet/mushroom/relax_0.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.QuietReaderWalk0, path: "/assets/pet/mushroom/walk_0.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.ActiveSportIdle0, path: "/assets/pet/mushroom/idle_1.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.ActiveSportWalk0, path: "/assets/pet/mushroom/walk_3.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.CraftMakerIdle0, path: "/assets/pet/mushroom/craft_0.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.CraftMakerWalk0, path: "/assets/pet/mushroom/walk_1.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.TravelExplorerIdle0, path: "/assets/pet/mushroom/idle_2.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.TravelExplorerWalk0, path: "/assets/pet/mushroom/walk_2.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.SleepySoftIdle0, path: "/assets/pet/mushroom/sleep_1.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.SleepySoftWalk0, path: "/assets/pet/mushroom/walk_0.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.HealingCompanionIdle0, path: "/assets/pet/mushroom/relax_1.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.HealingCompanionWalk0, path: "/assets/pet/mushroom/walk_1.png", kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Furniture.Bed, path: "/assets/furniture/bed.png", kind: "furniture", width: 220, height: 150 },
  { key: AssetKeys.Furniture.Chair, path: "/assets/furniture/chair.png", kind: "furniture", width: 95, height: 110 },
  { key: AssetKeys.Furniture.Desk, path: "/assets/furniture/desk.png", kind: "furniture", width: 190, height: 115 },
  { key: AssetKeys.Furniture.ExerciseEquipment, path: "/assets/furniture/exercise_equipment.png", kind: "furniture", width: 150, height: 135 },
  { key: AssetKeys.Furniture.FoodBowl, path: "/assets/furniture/food_bowl.png", kind: "furniture", width: 80, height: 55 },
  { key: AssetKeys.Furniture.Toy, path: "/assets/furniture/toy.png", kind: "furniture", width: 85, height: 75 },
  { key: AssetKeys.Furniture.Sofa, path: "/assets/furniture/sofa.png", kind: "furniture", width: 215, height: 145 },
  { key: AssetKeys.Furniture.Bookshelf, path: "/assets/furniture/bookshelf.png", kind: "furniture", width: 150, height: 190 },
  { key: AssetKeys.Furniture.Wardrobe, path: "/assets/furniture/wardrobe.png", kind: "furniture", width: 150, height: 205 },
  { key: AssetKeys.Furniture.Decoration, path: "/assets/furniture/decoration.png", kind: "furniture", width: 80, height: 80 },
  { key: AssetKeys.Collection.Postcard001, path: "/assets/animal-island-ui/items/item-020.png", kind: "collection", width: 180, height: 120 },
  { key: AssetKeys.Collection.Postcard002, path: "/assets/animal-island-ui/items/item-001.png", kind: "collection", width: 180, height: 120 },
  { key: AssetKeys.Collection.Postcard003, path: "/assets/animal-island-ui/items/item-145.png", kind: "collection", width: 180, height: 120 },
  { key: AssetKeys.Collection.Craft001, path: "/assets/animal-island-ui/items/item-005.png", kind: "collection", width: 140, height: 120 },
  { key: AssetKeys.Collection.Craft002, path: "/assets/animal-island-ui/items/item-033.png", kind: "collection", width: 140, height: 120 },
  { key: AssetKeys.Collection.Craft003, path: "/assets/animal-island-ui/items/item-248.png", kind: "collection", width: 140, height: 120 },
  { key: AssetKeys.Clothing.HatSmallCap, path: "/assets/clothing/hats/hat_small_cap.png", kind: "clothing", width: 64, height: 48 },
  { key: AssetKeys.Clothing.HeadStar, path: "/assets/clothing/head_accessories/head_star.png", kind: "clothing", width: 48, height: 48 },
  { key: AssetKeys.Clothing.NeckSoftScarf, path: "/assets/clothing/neck_accessories/neck_soft_scarf.png", kind: "clothing", width: 80, height: 42 },
  { key: AssetKeys.Clothing.BodyTinyBag, path: "/assets/clothing/body_accessories/body_tiny_bag.png", kind: "clothing", width: 74, height: 66 },
  { key: AssetKeys.Clothing.TailBow, path: "/assets/clothing/tail_accessories/tail_bow.png", kind: "clothing", width: 56, height: 44 },
  { key: AssetKeys.UI.Panel, path: "/assets/animal-island-ui/items/item-001.png", kind: "ui", width: 64, height: 64 },
  { key: AssetKeys.UI.Button, path: "/assets/animal-island-ui/items/item-005.png", kind: "button", width: 64, height: 64 },
  { key: AssetKeys.UI.ButtonPressed, path: "/assets/animal-island-ui/items/item-020.png", kind: "button", width: 64, height: 64 },
  { key: AssetKeys.UI.IconLetter, path: "/assets/animal-island-ui/icons/icon-chat.svg", kind: "ui", width: 48, height: 48 },
  { key: AssetKeys.UI.IconCollection, path: "/assets/animal-island-ui/icons/icon-critterpedia.svg", kind: "ui", width: 48, height: 48 },
  { key: AssetKeys.UI.IconWardrobe, path: "/assets/animal-island-ui/icons/icon-shopping.svg", kind: "ui", width: 48, height: 48 },
  { key: AssetKeys.UI.IconSettings, path: "/assets/animal-island-ui/icons/icon-map.svg", kind: "ui", width: 48, height: 48 },
  { key: AssetKeys.UI.IconArrange, path: "/assets/animal-island-ui/icons/icon-diy.svg", kind: "ui", width: 48, height: 48 },
  { key: AssetKeys.UI.IconMap, path: "/assets/animal-island-ui/icons/icon-map.svg", kind: "ui", width: 48, height: 48 },
  { key: AssetKeys.UI.IconShopping, path: "/assets/animal-island-ui/icons/icon-shopping.svg", kind: "ui", width: 48, height: 48 },
  { key: AssetKeys.UI.IconDiy, path: "/assets/animal-island-ui/icons/icon-diy.svg", kind: "ui", width: 48, height: 48 },
  { key: AssetKeys.UI.IconLeaf, path: "/assets/animal-island-ui/icons/icon-leaf.png", kind: "ui", width: 48, height: 48 },
  { key: AssetKeys.UI.DividerBrown, path: "/assets/animal-island-ui/dividers/divider-line-brown.svg", kind: "ui", width: 220, height: 16 },
  { key: AssetKeys.UI.DividerYellow, path: "/assets/animal-island-ui/dividers/divider-line-yellow.svg", kind: "ui", width: 220, height: 16 },
  { key: AssetKeys.UI.WaveYellow, path: "/assets/animal-island-ui/dividers/wave-yellow.svg", kind: "ui", width: 240, height: 36 }
];

const furnitureTextureKeys: Record<FurnitureType, string> = {
  [FurnitureType.Bed]: AssetKeys.Furniture.Bed,
  [FurnitureType.Chair]: AssetKeys.Furniture.Chair,
  [FurnitureType.Desk]: AssetKeys.Furniture.Desk,
  [FurnitureType.ExerciseEquipment]: AssetKeys.Furniture.ExerciseEquipment,
  [FurnitureType.FoodBowl]: AssetKeys.Furniture.FoodBowl,
  [FurnitureType.Toy]: AssetKeys.Furniture.Toy,
  [FurnitureType.Pot]: AssetKeys.Growth.PotSproutGrowing,
  [FurnitureType.Sofa]: AssetKeys.Furniture.Sofa,
  [FurnitureType.Bookshelf]: AssetKeys.Furniture.Bookshelf,
  [FurnitureType.Wardrobe]: AssetKeys.Furniture.Wardrobe,
  [FurnitureType.Decoration]: AssetKeys.Furniture.Decoration
};

export function getFurnitureTextureKey(type: FurnitureType): string {
  return furnitureTextureKeys[type] ?? AssetKeys.Furniture.Decoration;
}

export function normalizeFurnitureRotationDegrees(rotation: number): -30 | 0 | 30 {
  const degrees = Math.abs(rotation) <= Math.PI * 2 ? (rotation * 180) / Math.PI : rotation;
  const options = [-30, 0, 30] as const;
  return options.reduce((nearest, option) => (Math.abs(option - degrees) < Math.abs(nearest - degrees) ? option : nearest), 0);
}

export function getFurnitureRotationRadians(rotation: number): number {
  return (normalizeFurnitureRotationDegrees(rotation) * Math.PI) / 180;
}

type AdultPose = "idle" | "sit" | "sleep" | "play" | "click";

type AdultTextureSet = {
  idle: string;
  walkFrames: string[];
  sit?: string;
  sleep?: string;
  play?: string;
  click?: string;
  clickFrames?: string[];
};

const DEFAULT_ADULT_FORM_ID = "ian_adult";

const adultTextureSets: Record<string, AdultTextureSet> = {
  ian_adult: {
    idle: AssetKeys.Pet.Adult.IanIdle0,
    walkFrames: [
      AssetKeys.Pet.Adult.IanWalk0,
      AssetKeys.Pet.Adult.IanWalk1,
      AssetKeys.Pet.Adult.IanWalk2,
      AssetKeys.Pet.Adult.IanWalk3,
      AssetKeys.Pet.Adult.IanWalk4
    ],
    sit: AssetKeys.Pet.Adult.IanSit0,
    sleep: AssetKeys.Pet.Adult.IanSleep0,
    play: AssetKeys.Pet.Adult.IanPlay0,
    click: AssetKeys.Pet.Adult.IanClick1,
    clickFrames: [AssetKeys.Pet.Adult.IanClick0, AssetKeys.Pet.Adult.IanClick1, AssetKeys.Pet.Adult.IanClick0, AssetKeys.Pet.Adult.IanIdle0]
  },
  quiet_reader: {
    idle: AssetKeys.Pet.Adult.QuietReaderIdle0,
    walkFrames: [AssetKeys.Pet.Adult.QuietReaderWalk0]
  },
  active_sport: {
    idle: AssetKeys.Pet.Adult.ActiveSportIdle0,
    walkFrames: [AssetKeys.Pet.Adult.ActiveSportWalk0]
  },
  craft_maker: {
    idle: AssetKeys.Pet.Adult.CraftMakerIdle0,
    walkFrames: [AssetKeys.Pet.Adult.CraftMakerWalk0]
  },
  travel_explorer: {
    idle: AssetKeys.Pet.Adult.TravelExplorerIdle0,
    walkFrames: [AssetKeys.Pet.Adult.TravelExplorerWalk0]
  },
  sleepy_soft: {
    idle: AssetKeys.Pet.Adult.SleepySoftIdle0,
    walkFrames: [AssetKeys.Pet.Adult.SleepySoftWalk0]
  },
  healing_companion: {
    idle: AssetKeys.Pet.Adult.HealingCompanionIdle0,
    walkFrames: [AssetKeys.Pet.Adult.HealingCompanionWalk0]
  }
};

export const adultAnimationFormIds = Object.keys(adultTextureSets);

export const AdultAnimationKeys = {
  IanIdle: "pet_adult_ian_adult_idle",
  IanWalk: "pet_adult_ian_adult_walk",
  IanClick: "pet_adult_ian_adult_click"
} as const;

export function getAdultIdleKey(formId?: string): string {
  return resolveAdultTextureSet(formId).idle;
}

export function getAdultPoseKey(formId: string | undefined, pose: AdultPose): string {
  const set = resolveAdultTextureSet(formId);
  return set[pose] ?? set.idle;
}

export function getAdultWalkAnimationKey(formId?: string): string {
  return `pet_adult_${resolveAdultFormId(formId)}_walk`;
}

export function getAdultClickAnimationKey(formId?: string): string {
  return `pet_adult_${resolveAdultFormId(formId)}_click`;
}

export function getAdultWalkFrameKeys(formId?: string): string[] {
  const set = resolveAdultTextureSet(formId);
  return set.walkFrames.length > 0 ? set.walkFrames : [set.idle];
}

export function getAdultClickFrameKeys(formId?: string): string[] {
  const set = resolveAdultTextureSet(formId);
  return set.clickFrames ?? [set.idle, set.walkFrames[0] ?? set.idle, set.idle];
}

export const adultWalkFrameKeys = getAdultWalkFrameKeys(DEFAULT_ADULT_FORM_ID);

function resolveAdultFormId(formId?: string): string {
  return formId && adultTextureSets[formId] ? formId : DEFAULT_ADULT_FORM_ID;
}

function resolveAdultTextureSet(formId?: string): AdultTextureSet {
  return adultTextureSets[resolveAdultFormId(formId)];
}
