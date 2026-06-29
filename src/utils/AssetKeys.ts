import { FurnitureType } from "../data/types";

export type AssetManifestItem = {
  key: string;
  path: string;
  kind: "cover" | "button" | "room" | "growth" | "baby" | "adult" | "furniture" | "collection" | "clothing" | "ui";
  width?: number;
  height?: number;
};

const BASE_URL = import.meta.env.BASE_URL ?? "/";

function assetPath(path: string): string {
  const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${cleanPath}`;
}

export const AssetKeys = {
  Start: {
    HomeBackground: "start_home_background",
    HomeTitle: "start_home_title",
    StartHero: "start_home_hero",
    CoverBackground: "start_home_background",
    GameLogo: "start_home_title",
    StartButton: "start_button_petpet",
    ContinueButton: "continue_button",
    SettingsButton: "settings_button_petpet"
  },
  Room: {
    PetpetBackground: "room_petpet_background",
    CosyBackground: "room_petpet_background",
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
    Seed: "growth_seed",
    OpeningPot: "growth_opening_pot",
    OpeningSeed: "growth_opening_seed"
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
      IanWalk5: "pet_adult_ian_walk_5",
      IanWalk6: "pet_adult_ian_walk_6",
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
    BedLeft: "furniture_bed_left",
    BedRight: "furniture_bed_right",
    Chair: "furniture_chair",
    ChairLeft: "furniture_chair_left",
    ChairRight: "furniture_chair_right",
    Desk: "furniture_desk",
    DeskLeft: "furniture_desk_left",
    DeskRight: "furniture_desk_right",
    ExerciseEquipment: "furniture_treadmill_right",
    TreadmillLeft: "furniture_treadmill_left",
    TreadmillRight: "furniture_treadmill_right",
    FoodBowl: "furniture_food_bowl",
    Toy: "furniture_toy",
    Plant: "furniture_plant",
    Sofa: "furniture_sofa",
    SofaLeft: "furniture_sofa_left",
    SofaRight: "furniture_sofa_right",
    Bookshelf: "furniture_bookshelf",
    BookshelfLeft: "furniture_bookshelf_left",
    BookshelfRight: "furniture_bookshelf_right",
    Wardrobe: "furniture_wardrobe",
    WardrobeLeft: "furniture_wardrobe_left",
    WardrobeRight: "furniture_wardrobe_right",
    Decoration: "furniture_painting",
    Rug: "furniture_rug",
    Painting: "furniture_painting",
    CoffeeTable: "furniture_coffee_table",
    TvCabinet: "furniture_tv_cabinet_right",
    TvCabinetLeft: "furniture_tv_cabinet_left",
    TvCabinetRight: "furniture_tv_cabinet_right"
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
  ClothingPreview: {
    PersonFront: "clothing_preview_person_front",
    PersonSide: "clothing_preview_person_side",
    PersonBack: "clothing_preview_person_back",
    HatFront: "clothing_preview_hat_front",
    HatSide: "clothing_preview_hat_side",
    HatBack: "clothing_preview_hat_back"
  },
  UI: {
    Panel: "ui_panel",
    Button: "ui_button",
    ButtonPressed: "ui_button_pressed",
    IconHome: "ui_icon_home",
    IconLetter: "ui_icon_letter",
    IconCollection: "ui_icon_collection",
    IconWardrobe: "ui_icon_wardrobe",
    IconSettings: "ui_icon_settings",
    IconArrange: "ui_icon_arrange",
    IconRecord: "ui_icon_record",
    IconMap: "ui_icon_map",
    IconShopping: "ui_icon_shopping",
    IconDiy: "ui_icon_diy",
    IconLeaf: "ui_icon_leaf",
    DividerBrown: "ui_divider_brown",
    DividerYellow: "ui_divider_yellow",
    WaveYellow: "ui_wave_yellow",
    LetterEnvelope: "ui_letter_envelope",
    EnvelopeDialogFrame: "ui_envelope_dialog_frame"
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
    path: assetPath(`assets/pet/mushroom/${group}_${index}.png`),
    kind: "baby" as const,
    width: MUSHROOM_FRAME_WIDTH,
    height: MUSHROOM_FRAME_HEIGHT
  }));
}

export const AssetManifest: AssetManifestItem[] = [
  { key: AssetKeys.Start.HomeBackground, path: assetPath("assets/start/home_background.png"), kind: "cover", width: 1280, height: 720 },
  { key: AssetKeys.Start.HomeTitle, path: assetPath("assets/start/home_title.png"), kind: "ui", width: 620, height: 288 },
  { key: AssetKeys.Start.StartHero, path: assetPath("assets/start/home_hero.png"), kind: "ui", width: 430, height: 550 },
  { key: AssetKeys.Start.StartButton, path: assetPath("assets/start/start_button_petpet.png"), kind: "button", width: 720, height: 240 },
  { key: AssetKeys.Start.ContinueButton, path: assetPath("assets/start/continue_button.png"), kind: "button", width: 260, height: 72 },
  { key: AssetKeys.Start.SettingsButton, path: assetPath("assets/start/settings_button_petpet.png"), kind: "button", width: 720, height: 240 },
  { key: AssetKeys.Room.PetpetBackground, path: assetPath("assets/room/petpet_room_background.png"), kind: "room", width: 1280, height: 720 },
  { key: AssetKeys.Room.Background, path: assetPath("assets/room/room_background.png"), kind: "room", width: 1280, height: 720 },
  { key: AssetKeys.Room.ShellBase, path: assetPath("assets/room/room_shell_base.png"), kind: "room", width: 1280, height: 720 },
  { key: AssetKeys.Room.Floor1, path: assetPath("assets/room/floor_1.png"), kind: "room", width: 840, height: 210 },
  { key: AssetKeys.Room.Floor2, path: assetPath("assets/room/floor_2.png"), kind: "room", width: 680, height: 160 },
  { key: AssetKeys.Room.BackWall, path: assetPath("assets/room/back_wall.png"), kind: "room" },
  { key: AssetKeys.Room.LeftWall, path: assetPath("assets/room/left_wall.png"), kind: "room" },
  { key: AssetKeys.Room.RightWall, path: assetPath("assets/room/right_wall.png"), kind: "room" },
  { key: AssetKeys.Room.Balcony, path: assetPath("assets/room/balcony.png"), kind: "room", width: 220, height: 120 },
  { key: AssetKeys.Room.Window, path: assetPath("assets/room/window.png"), kind: "room", width: 300, height: 230 },
  { key: AssetKeys.Room.Stairs, path: assetPath("assets/room/stairs.png"), kind: "room", width: 180, height: 210 },
  { key: AssetKeys.Room.Railing, path: assetPath("assets/room/railing.png"), kind: "room" },
  { key: AssetKeys.Room.LightShadow, path: assetPath("assets/room/light_shadow.png"), kind: "room" },
  { key: AssetKeys.Growth.PotEmpty, path: assetPath("assets/growth/pot_empty.png"), kind: "growth", width: 160, height: 140 },
  { key: AssetKeys.Growth.PotSoil, path: assetPath("assets/growth/pot_soil.png"), kind: "growth", width: 160, height: 140 },
  { key: AssetKeys.Growth.PotSproutSmall, path: assetPath("assets/growth/pot_sprout_small.png"), kind: "growth", width: 96, height: 126 },
  { key: AssetKeys.Growth.PotSproutGrowing, path: assetPath("assets/growth/pot_sprout_growing.png"), kind: "growth", width: 96, height: 140 },
  { key: AssetKeys.Growth.Seed, path: assetPath("assets/growth/opening_seed.png"), kind: "growth", width: 150, height: 150 },
  { key: AssetKeys.Growth.OpeningPot, path: assetPath("assets/growth/opening_pot.png"), kind: "growth", width: 260, height: 220 },
  { key: AssetKeys.Growth.OpeningSeed, path: assetPath("assets/growth/opening_seed.png"), kind: "growth", width: 150, height: 150 },
  ...createMushroomManifest("idle"),
  ...createMushroomManifest("walk"),
  ...createMushroomManifest("react"),
  ...createMushroomManifest("relax"),
  ...createMushroomManifest("sleep"),
  ...createMushroomManifest("craft"),
  { key: AssetKeys.Pet.BabyIdle0, path: assetPath("assets/pet/mushroom/idle_0.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyIdle1, path: assetPath("assets/pet/mushroom/idle_1.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyClickSquash, path: assetPath("assets/pet/mushroom/react_0.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyClickStretch, path: assetPath("assets/pet/mushroom/react_1.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyClickTilt, path: assetPath("assets/pet/mushroom/react_2.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyWalk0, path: assetPath("assets/pet/mushroom/walk_0.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyWalk1, path: assetPath("assets/pet/mushroom/walk_1.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyWalk2, path: assetPath("assets/pet/mushroom/walk_2.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyHappy0, path: assetPath("assets/pet/mushroom/react_3.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyQuestion0, path: assetPath("assets/pet/mushroom/idle_2.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabySad0, path: assetPath("assets/pet/mushroom/relax_3.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabySleep0, path: assetPath("assets/pet/mushroom/sleep_0.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyRead0, path: assetPath("assets/pet/mushroom/relax_0.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyExercise0, path: assetPath("assets/pet/mushroom/walk_3.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.BabyCraft0, path: assetPath("assets/pet/mushroom/craft_0.png"), kind: "baby", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanIdle0, path: assetPath("assets/pet/adult/ian/idle_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanSit0, path: assetPath("assets/pet/adult/ian/sit_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanSleep0, path: assetPath("assets/pet/adult/ian/sleep_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanPlay0, path: assetPath("assets/pet/adult/ian/play_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanClick0, path: assetPath("assets/pet/adult/ian/click_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanClick1, path: assetPath("assets/pet/adult/ian/click_1.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanWalk0, path: assetPath("assets/pet/adult/ian/walk_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanWalk1, path: assetPath("assets/pet/adult/ian/walk_1.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanWalk2, path: assetPath("assets/pet/adult/ian/walk_2.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanWalk3, path: assetPath("assets/pet/adult/ian/walk_3.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanWalk4, path: assetPath("assets/pet/adult/ian/walk_4.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanWalk5, path: assetPath("assets/pet/adult/ian/walk_5.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.IanWalk6, path: assetPath("assets/pet/adult/ian/walk_6.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.QuietReaderIdle0, path: assetPath("assets/pet/adult/quiet_reader/idle_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.QuietReaderWalk0, path: assetPath("assets/pet/adult/quiet_reader/walk_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.ActiveSportIdle0, path: assetPath("assets/pet/adult/active_sport/idle_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.ActiveSportWalk0, path: assetPath("assets/pet/adult/active_sport/walk_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.CraftMakerIdle0, path: assetPath("assets/pet/adult/craft_maker/idle_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.CraftMakerWalk0, path: assetPath("assets/pet/adult/craft_maker/walk_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.TravelExplorerIdle0, path: assetPath("assets/pet/adult/travel_explorer/idle_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.TravelExplorerWalk0, path: assetPath("assets/pet/adult/travel_explorer/walk_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.SleepySoftIdle0, path: assetPath("assets/pet/adult/sleepy_soft/idle_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.SleepySoftWalk0, path: assetPath("assets/pet/adult/sleepy_soft/walk_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.HealingCompanionIdle0, path: assetPath("assets/pet/adult/healing_companion/idle_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Pet.Adult.HealingCompanionWalk0, path: assetPath("assets/pet/adult/healing_companion/walk_0.png"), kind: "adult", width: 220, height: 240 },
  { key: AssetKeys.Furniture.Bed, path: assetPath("assets/furniture/bed.png"), kind: "furniture", width: 220, height: 150 },
  { key: AssetKeys.Furniture.BedLeft, path: assetPath("assets/furniture/bed_left.png"), kind: "furniture", width: 220, height: 150 },
  { key: AssetKeys.Furniture.BedRight, path: assetPath("assets/furniture/bed_right.png"), kind: "furniture", width: 220, height: 150 },
  { key: AssetKeys.Furniture.Chair, path: assetPath("assets/furniture/chair.png"), kind: "furniture", width: 95, height: 110 },
  { key: AssetKeys.Furniture.ChairLeft, path: assetPath("assets/furniture/chair_left.png"), kind: "furniture", width: 95, height: 110 },
  { key: AssetKeys.Furniture.ChairRight, path: assetPath("assets/furniture/chair_right.png"), kind: "furniture", width: 95, height: 110 },
  { key: AssetKeys.Furniture.Desk, path: assetPath("assets/furniture/desk.png"), kind: "furniture", width: 190, height: 115 },
  { key: AssetKeys.Furniture.DeskLeft, path: assetPath("assets/furniture/desk_left.png"), kind: "furniture", width: 190, height: 115 },
  { key: AssetKeys.Furniture.DeskRight, path: assetPath("assets/furniture/desk_right.png"), kind: "furniture", width: 190, height: 115 },
  { key: AssetKeys.Furniture.ExerciseEquipment, path: assetPath("assets/furniture/treadmill_right.png"), kind: "furniture", width: 150, height: 135 },
  { key: AssetKeys.Furniture.TreadmillLeft, path: assetPath("assets/furniture/treadmill_left.png"), kind: "furniture", width: 150, height: 135 },
  { key: AssetKeys.Furniture.TreadmillRight, path: assetPath("assets/furniture/treadmill_right.png"), kind: "furniture", width: 150, height: 135 },
  { key: AssetKeys.Furniture.FoodBowl, path: assetPath("assets/furniture/food_bowl.png"), kind: "furniture", width: 80, height: 55 },
  { key: AssetKeys.Furniture.Toy, path: assetPath("assets/furniture/toy.png"), kind: "furniture", width: 85, height: 75 },
  { key: AssetKeys.Furniture.Plant, path: assetPath("assets/furniture/plant.png"), kind: "furniture", width: 96, height: 120 },
  { key: AssetKeys.Furniture.Sofa, path: assetPath("assets/furniture/sofa.png"), kind: "furniture", width: 215, height: 145 },
  { key: AssetKeys.Furniture.SofaLeft, path: assetPath("assets/furniture/sofa_left.png"), kind: "furniture", width: 215, height: 145 },
  { key: AssetKeys.Furniture.SofaRight, path: assetPath("assets/furniture/sofa_right.png"), kind: "furniture", width: 215, height: 145 },
  { key: AssetKeys.Furniture.Bookshelf, path: assetPath("assets/furniture/bookshelf.png"), kind: "furniture", width: 150, height: 190 },
  { key: AssetKeys.Furniture.BookshelfLeft, path: assetPath("assets/furniture/bookshelf_left.png"), kind: "furniture", width: 150, height: 190 },
  { key: AssetKeys.Furniture.BookshelfRight, path: assetPath("assets/furniture/bookshelf_right.png"), kind: "furniture", width: 150, height: 190 },
  { key: AssetKeys.Furniture.Wardrobe, path: assetPath("assets/furniture/wardrobe.png"), kind: "furniture", width: 150, height: 205 },
  { key: AssetKeys.Furniture.WardrobeLeft, path: assetPath("assets/furniture/wardrobe_left.png"), kind: "furniture", width: 150, height: 205 },
  { key: AssetKeys.Furniture.WardrobeRight, path: assetPath("assets/furniture/wardrobe_right.png"), kind: "furniture", width: 150, height: 205 },
  { key: AssetKeys.Furniture.Rug, path: assetPath("assets/furniture/rug.png"), kind: "furniture", width: 230, height: 125 },
  { key: AssetKeys.Furniture.Painting, path: assetPath("assets/furniture/painting.png"), kind: "furniture", width: 120, height: 100 },
  { key: AssetKeys.Furniture.CoffeeTable, path: assetPath("assets/furniture/coffee_table.png"), kind: "furniture", width: 180, height: 105 },
  { key: AssetKeys.Furniture.TvCabinet, path: assetPath("assets/furniture/tv_cabinet_right.png"), kind: "furniture", width: 190, height: 125 },
  { key: AssetKeys.Furniture.TvCabinetLeft, path: assetPath("assets/furniture/tv_cabinet_left.png"), kind: "furniture", width: 190, height: 125 },
  { key: AssetKeys.Furniture.TvCabinetRight, path: assetPath("assets/furniture/tv_cabinet_right.png"), kind: "furniture", width: 190, height: 125 },
  { key: AssetKeys.Collection.Postcard001, path: assetPath("assets/animal-island-ui/items/item-020.png"), kind: "collection", width: 180, height: 120 },
  { key: AssetKeys.Collection.Postcard002, path: assetPath("assets/animal-island-ui/items/item-001.png"), kind: "collection", width: 180, height: 120 },
  { key: AssetKeys.Collection.Postcard003, path: assetPath("assets/animal-island-ui/items/item-145.png"), kind: "collection", width: 180, height: 120 },
  { key: AssetKeys.Collection.Craft001, path: assetPath("assets/animal-island-ui/items/item-005.png"), kind: "collection", width: 140, height: 120 },
  { key: AssetKeys.Collection.Craft002, path: assetPath("assets/animal-island-ui/items/item-033.png"), kind: "collection", width: 140, height: 120 },
  { key: AssetKeys.Collection.Craft003, path: assetPath("assets/animal-island-ui/items/item-248.png"), kind: "collection", width: 140, height: 120 },
  { key: AssetKeys.Clothing.HatSmallCap, path: assetPath("assets/clothing/hats/hat_small_cap.png"), kind: "clothing", width: 64, height: 48 },
  { key: AssetKeys.Clothing.HeadStar, path: assetPath("assets/clothing/head_accessories/head_star.png"), kind: "clothing", width: 48, height: 48 },
  { key: AssetKeys.Clothing.NeckSoftScarf, path: assetPath("assets/clothing/neck_accessories/neck_soft_scarf.png"), kind: "clothing", width: 80, height: 42 },
  { key: AssetKeys.Clothing.BodyTinyBag, path: assetPath("assets/clothing/body_accessories/body_tiny_bag.png"), kind: "clothing", width: 74, height: 66 },
  { key: AssetKeys.Clothing.TailBow, path: assetPath("assets/clothing/tail_accessories/tail_bow.png"), kind: "clothing", width: 56, height: 44 },
  { key: AssetKeys.ClothingPreview.PersonFront, path: assetPath("assets/clothing/petpet_preview/person_front.png"), kind: "clothing", width: 180, height: 240 },
  { key: AssetKeys.ClothingPreview.PersonSide, path: assetPath("assets/clothing/petpet_preview/person_side.png"), kind: "clothing", width: 180, height: 240 },
  { key: AssetKeys.ClothingPreview.PersonBack, path: assetPath("assets/clothing/petpet_preview/person_back.png"), kind: "clothing", width: 180, height: 240 },
  { key: AssetKeys.ClothingPreview.HatFront, path: assetPath("assets/clothing/petpet_preview/hat_front.png"), kind: "clothing", width: 180, height: 240 },
  { key: AssetKeys.ClothingPreview.HatSide, path: assetPath("assets/clothing/petpet_preview/hat_side.png"), kind: "clothing", width: 180, height: 240 },
  { key: AssetKeys.ClothingPreview.HatBack, path: assetPath("assets/clothing/petpet_preview/hat_back.png"), kind: "clothing", width: 180, height: 240 },
  { key: AssetKeys.UI.Panel, path: assetPath("assets/animal-island-ui/items/item-001.png"), kind: "ui", width: 64, height: 64 },
  { key: AssetKeys.UI.Button, path: assetPath("assets/animal-island-ui/items/item-005.png"), kind: "button", width: 64, height: 64 },
  { key: AssetKeys.UI.ButtonPressed, path: assetPath("assets/animal-island-ui/items/item-020.png"), kind: "button", width: 64, height: 64 },
  { key: AssetKeys.UI.IconHome, path: assetPath("assets/ui/petpet-icons/icon_home.png"), kind: "ui", width: 256, height: 256 },
  { key: AssetKeys.UI.IconLetter, path: assetPath("assets/ui/petpet-icons/icon_letter.png"), kind: "ui", width: 256, height: 256 },
  { key: AssetKeys.UI.IconCollection, path: assetPath("assets/ui/petpet-icons/icon_collection.png"), kind: "ui", width: 256, height: 256 },
  { key: AssetKeys.UI.IconWardrobe, path: assetPath("assets/animal-island-ui/icons/icon-shopping.svg"), kind: "ui", width: 48, height: 48 },
  { key: AssetKeys.UI.IconSettings, path: assetPath("assets/ui/petpet-icons/icon_settings.png"), kind: "ui", width: 256, height: 256 },
  { key: AssetKeys.UI.IconArrange, path: assetPath("assets/ui/petpet-icons/icon_arrange.png"), kind: "ui", width: 256, height: 256 },
  { key: AssetKeys.UI.IconRecord, path: assetPath("assets/ui/petpet-icons/icon_record.png"), kind: "ui", width: 256, height: 256 },
  { key: AssetKeys.UI.IconMap, path: assetPath("assets/ui/petpet-icons/icon_home.png"), kind: "ui", width: 256, height: 256 },
  { key: AssetKeys.UI.IconShopping, path: assetPath("assets/ui/petpet-icons/icon_collection.png"), kind: "ui", width: 256, height: 256 },
  { key: AssetKeys.UI.IconDiy, path: assetPath("assets/ui/petpet-icons/icon_arrange.png"), kind: "ui", width: 256, height: 256 },
  { key: AssetKeys.UI.IconLeaf, path: assetPath("assets/animal-island-ui/icons/icon-leaf.png"), kind: "ui", width: 48, height: 48 },
  { key: AssetKeys.UI.DividerBrown, path: assetPath("assets/animal-island-ui/dividers/divider-line-brown.svg"), kind: "ui", width: 220, height: 16 },
  { key: AssetKeys.UI.DividerYellow, path: assetPath("assets/animal-island-ui/dividers/divider-line-yellow.svg"), kind: "ui", width: 220, height: 16 },
  { key: AssetKeys.UI.WaveYellow, path: assetPath("assets/animal-island-ui/dividers/wave-yellow.svg"), kind: "ui", width: 240, height: 36 },
  { key: AssetKeys.UI.LetterEnvelope, path: assetPath("assets/ui/letter_envelope_background.png"), kind: "ui", width: 540, height: 720 },
  { key: AssetKeys.UI.EnvelopeDialogFrame, path: assetPath("assets/ui/letter_envelope_background.png"), kind: "ui", width: 540, height: 720 }
];

type FurnitureTextureSet = {
  front: string;
  left?: string;
  right?: string;
};

const furnitureTextureSets: Record<FurnitureType, FurnitureTextureSet> = {
  [FurnitureType.Bed]: { front: AssetKeys.Furniture.Bed, left: AssetKeys.Furniture.BedLeft, right: AssetKeys.Furniture.BedRight },
  [FurnitureType.Chair]: { front: AssetKeys.Furniture.Chair, left: AssetKeys.Furniture.ChairLeft, right: AssetKeys.Furniture.ChairRight },
  [FurnitureType.Desk]: { front: AssetKeys.Furniture.Desk, left: AssetKeys.Furniture.DeskLeft, right: AssetKeys.Furniture.DeskRight },
  [FurnitureType.ExerciseEquipment]: { front: AssetKeys.Furniture.TreadmillRight, left: AssetKeys.Furniture.TreadmillLeft, right: AssetKeys.Furniture.TreadmillRight },
  [FurnitureType.FoodBowl]: { front: AssetKeys.Furniture.FoodBowl },
  [FurnitureType.Toy]: { front: AssetKeys.Furniture.Toy },
  [FurnitureType.Pot]: { front: AssetKeys.Furniture.Plant },
  [FurnitureType.Sofa]: { front: AssetKeys.Furniture.Sofa, left: AssetKeys.Furniture.SofaLeft, right: AssetKeys.Furniture.SofaRight },
  [FurnitureType.Bookshelf]: { front: AssetKeys.Furniture.BookshelfRight, left: AssetKeys.Furniture.BookshelfLeft, right: AssetKeys.Furniture.BookshelfRight },
  [FurnitureType.Wardrobe]: { front: AssetKeys.Furniture.Wardrobe, left: AssetKeys.Furniture.WardrobeLeft, right: AssetKeys.Furniture.WardrobeRight },
  [FurnitureType.Decoration]: { front: AssetKeys.Furniture.Painting },
  [FurnitureType.Rug]: { front: AssetKeys.Furniture.Rug },
  [FurnitureType.Painting]: { front: AssetKeys.Furniture.Painting },
  [FurnitureType.CoffeeTable]: { front: AssetKeys.Furniture.CoffeeTable },
  [FurnitureType.TvCabinet]: { front: AssetKeys.Furniture.TvCabinetRight, left: AssetKeys.Furniture.TvCabinetLeft, right: AssetKeys.Furniture.TvCabinetRight }
};

export function getFurnitureTextureKey(type: FurnitureType, rotation = 0): string {
  const set = furnitureTextureSets[type] ?? furnitureTextureSets[FurnitureType.Painting];
  const direction = normalizeFurnitureRotationDegrees(rotation);
  if (direction < 0) return set.left ?? set.front;
  if (direction > 0) return set.right ?? set.front;
  return set.front;
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
  idleFrames?: string[];
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
    idleFrames: [AssetKeys.Pet.Adult.IanIdle0, AssetKeys.Pet.Adult.IanSit0, AssetKeys.Pet.Adult.IanClick0, AssetKeys.Pet.Adult.IanSit0],
    walkFrames: [
      AssetKeys.Pet.Adult.IanWalk0,
      AssetKeys.Pet.Adult.IanWalk1,
      AssetKeys.Pet.Adult.IanWalk2,
      AssetKeys.Pet.Adult.IanWalk3,
      AssetKeys.Pet.Adult.IanWalk4,
      AssetKeys.Pet.Adult.IanWalk5,
      AssetKeys.Pet.Adult.IanWalk6
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

export function getAdultIdleAnimationKey(formId?: string): string {
  return `pet_adult_${resolveAdultFormId(formId)}_idle`;
}

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

export function getAdultIdleFrameKeys(formId?: string): string[] {
  const set = resolveAdultTextureSet(formId);
  return set.idleFrames ?? [set.idle];
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
