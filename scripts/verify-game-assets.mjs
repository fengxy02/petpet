import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = process.cwd();
const failures = [];

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function parsePng(relativePath, requireAlpha = true) {
  expect(fileExists(relativePath), `${relativePath} should exist`);
  if (!fileExists(relativePath)) {
    return { width: 1, height: 1, pixels: Buffer.from([0, 0, 0, 0]) };
  }
  const bytes = fs.readFileSync(path.join(root, relativePath));
  expect(bytes.slice(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `${relativePath} is not a PNG`);
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];

  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const data = bytes.slice(dataStart, dataEnd);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    }
    if (type === "IDAT") idat.push(data);
    if (type === "IEND") break;
    offset = dataEnd + 4;
  }

  if (requireAlpha) {
    expect(bitDepth === 8 && colorType === 6, `${relativePath} must be 8-bit RGBA PNG for alpha verification`);
  }
  if (bitDepth !== 8 || colorType !== 6) {
    return { width, height, pixels: Buffer.alloc(Math.max(1, width * height * 4)) };
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const channels = 4;
  const stride = width * channels;
  const pixels = Buffer.alloc(width * height * channels);
  let rawOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = raw[rawOffset];
    rawOffset += 1;
    for (let x = 0; x < stride; x += 1) {
      const value = raw[rawOffset + x];
      const left = x >= channels ? pixels[y * stride + x - channels] : 0;
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const upLeft = y > 0 && x >= channels ? pixels[(y - 1) * stride + x - channels] : 0;
      let decoded = value;
      if (filter === 1) decoded = (value + left) & 255;
      if (filter === 2) decoded = (value + up) & 255;
      if (filter === 3) decoded = (value + Math.floor((left + up) / 2)) & 255;
      if (filter === 4) decoded = (value + paeth(left, up, upLeft)) & 255;
      pixels[y * stride + x] = decoded;
    }
    rawOffset += stride;
  }

  return { width, height, pixels };
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function alphaAt(png, x, y) {
  return png.pixels[(y * png.width + x) * 4 + 3];
}

const assetKeys = readText("src/utils/AssetKeys.ts");
const preload = readText("src/scenes/PreloadScene.ts");
const pet = readText("src/entities/Pet.ts");
const roomLayout = readText("src/data/roomLayout.ts");
const wardrobe = readText("src/scenes/WardrobeScene.ts");
const clothingDatabase = readText("src/data/clothingDatabase.ts");
const furnitureDatabase = readText("src/data/furnitureDatabase.ts");
const defaultSave = readText("src/data/defaultSave.ts");
const saveSystem = readText("src/systems/SaveSystem.ts");
const roomArrange = readText("src/scenes/RoomArrangeScene.ts");
const mainRoom = readText("src/scenes/MainRoomScene.ts");
const gameConfig = readText("src/game/config.ts");
const packageJson = readText("package.json");
const indexHtml = readText("index.html");

expect(packageJson.includes('"name": "petpet"'), "package.json should use the petpet project name");
expect(packageJson.includes("vite build --base=/petpet/"), "Production build should use the /petpet/ GitHub Pages base");
expect(indexHtml.includes("<title>petpet</title>"), "index.html title should be petpet");
expect(assetKeys.includes("StartHero"), "AssetKeys should include the cleaned start screen hero");
expect(assetKeys.includes("HomeBackground"), "AssetKeys should include the new home background");
for (const iconKey of ["IconHome", "IconArrange", "IconCollection", "IconLetter", "IconSettings", "IconRecord"]) {
  expect(assetKeys.includes(iconKey), `AssetKeys should include UI.${iconKey}`);
}
expect(mainRoom.includes("RecordBoardScene"), "MainRoomScene should expose the record board entry");
expect(gameConfig.includes("RecordBoardScene"), "RecordBoardScene should be registered in the Phaser scene list");
expect(assetKeys.includes("getFurnitureTextureKey(type: FurnitureType, rotation"), "Furniture texture lookup should account for rotation");
expect(roomLayout.includes("blocksPlacement"), "Furniture placement definitions should mark non-blocking decor such as rugs and paintings");
for (const typeName of ["Rug", "Painting", "CoffeeTable", "TvCabinet"]) {
  expect(assetKeys.includes(`Furniture.${typeName}`), `AssetKeys should expose Furniture.${typeName}`);
}
for (const typeName of ["Rug", "Painting", "CoffeeTable", "TvCabinet"]) {
  expect(roomLayout.includes(`FurnitureType.${typeName}`), `Room layout should support FurnitureType.${typeName}`);
}
expect(assetKeys.includes("MushroomFrames"), "AssetKeys should expose complete mushroom frame groups");
expect(assetKeys.includes("MushroomAnimationKeys"), "AssetKeys should expose mushroom animation keys");
for (const anim of ["Idle", "Walk", "React", "Relax", "Sleep", "Craft"]) {
  expect(preload.includes(`MushroomAnimationKeys.${anim}`), `PreloadScene should create MushroomAnimationKeys.${anim}`);
}
for (const state of ["PetState.Sleeping", "PetState.Reading", "PetState.Resting", "PetState.Crafting"]) {
  expect(pet.includes(state) && pet.includes("MushroomAnimationKeys"), `Pet should route ${state} through mushroom animations`);
}
expect(preload.includes("MUSHROOM_ANIMATION_FRAME_RATES"), "PreloadScene should keep mushroom animation speeds in one adjustable constant");
expect(pet.includes("faceTarget(next.x)") && pet.includes("targetX < this.x"), "Pet should mirror left-facing movement for every growth stage");
expect(!clothingDatabase.includes("tail_bow"), "Clothing database should not include tail accessories");
expect(!/const slots = \[[\s\S]*TailAccessory[\s\S]*\];/.test(wardrobe), "Wardrobe slot rows should not include tail accessories");
for (const oldDefault of ["exercise_1", "food_1", "toy_1"]) {
  expect(!new RegExp(`id:\\s*"${oldDefault}"`).test(roomLayout), `Default room should not place old unsupported furniture ${oldDefault}`);
}
expect(furnitureDatabase.includes("defaultStoredFurnitureItems"), "Furniture database should expose default stored furniture for the arrange inventory");
expect(defaultSave.includes("defaultStoredFurnitureItems"), "New saves should start from stored furniture, not placed furniture");
expect(roomLayout.includes("source.isPlaced ?? defaultItem.isPlaced"), "Furniture normalization should preserve the default stored state when placement is missing");
expect(saveSystem.includes("isDefaultPlacedFurnitureLayout"), "Save migration should move the old untouched default room into storage");
expect(roomArrange.includes("placeStoredFurnitureInFirstAvailableCell"), "Arrange inventory should let players select stored furniture into the room");

for (const file of [
  "bed.png",
  "bed_left.png",
  "bed_right.png",
  "chair_left.png",
  "chair_right.png",
  "desk.png",
  "desk_left.png",
  "desk_right.png",
  "sofa.png",
  "sofa_left.png",
  "sofa_right.png",
  "wardrobe.png",
  "wardrobe_left.png",
  "wardrobe_right.png",
  "rug.png",
  "painting.png",
  "bookshelf_left.png",
  "bookshelf_right.png",
  "treadmill_left.png",
  "treadmill_right.png",
  "tv_cabinet_left.png",
  "tv_cabinet_right.png",
  "plant.png",
  "coffee_table.png"
]) {
  const png = parsePng(`public/assets/furniture/${file}`);
  const cornerAlpha = [
    alphaAt(png, 0, 0),
    alphaAt(png, png.width - 1, 0),
    alphaAt(png, 0, png.height - 1),
    alphaAt(png, png.width - 1, png.height - 1)
  ];
  expect(cornerAlpha.every((alpha) => alpha <= 8), `${file} should have transparent corners after background removal`);
}

for (const file of ["home_background.png", "home_title.png", "home_hero.png", "start_button_petpet.png", "settings_button_petpet.png"]) {
  const png = parsePng(`public/assets/start/${file}`, false);
  expect(png.width > 1 && png.height > 1, `${file} should be a valid start screen asset`);
}

for (const file of ["icon_home.png", "icon_arrange.png", "icon_collection.png", "icon_letter.png", "icon_settings.png", "icon_record.png"]) {
  const png = parsePng(`public/assets/ui/petpet-icons/${file}`);
  expect(png.width === 256 && png.height === 256, `${file} should be normalized to 256x256`);
  const cornerAlpha = [
    alphaAt(png, 0, 0),
    alphaAt(png, png.width - 1, 0),
    alphaAt(png, 0, png.height - 1),
    alphaAt(png, png.width - 1, png.height - 1)
  ];
  expect(cornerAlpha.every((alpha) => alpha <= 8), `${file} should have transparent corners after background removal`);
}

for (const group of ["idle", "walk", "react", "relax", "sleep", "craft"]) {
  const expected = group === "sleep" ? 7 : group === "walk" ? 6 : 4;
  for (let index = 0; index < expected; index += 1) {
    expect(fileExists(`public/assets/pet/mushroom/${group}_${index}.png`), `mushroom ${group}_${index}.png should exist`);
  }
}

for (const file of ["idle_0.png", "click_0.png", "click_1.png", "sleep_0.png", "walk_0.png", "walk_1.png", "walk_2.png", "walk_3.png", "walk_4.png", "walk_5.png", "walk_6.png"]) {
  const png = parsePng(`public/assets/pet/adult/ian/${file}`);
  expect(alphaAt(png, 0, 0) <= 8, `Ian ${file} should have transparent corners`);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Game asset wiring checks passed.");
