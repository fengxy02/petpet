import { FurnitureSaveData, FurnitureSurface, FurnitureType, GrowthStage } from "./types";
import { normalizeFurnitureRotationDegrees } from "../utils/AssetKeys";

export type RoomPoint = {
  x: number;
  y: number;
};

export type RoomSurfaceTheme = {
  wallpaper: {
    key: string;
    size: number;
    baseColor: number;
    stripeColor: number;
    dotColor: number;
    alpha: number;
    wallAngles: {
      back: number;
      left: number;
      right: number;
    };
  };
  flooring: {
    key: string;
    width: number;
    height: number;
    baseColor: number;
    plankColor: number;
    grainColor: number;
    alpha: number;
    angle: number;
  };
  trimColor: number;
  shadowColor: number;
  shadowAlpha: number;
};

export type FurnitureGridCell = {
  id: string;
  surface: FurnitureSurface;
  x: number;
  y: number;
  row: number;
  col: number;
  polygon: RoomPoint[];
  blocked?: boolean;
};

export type FurniturePlacementDefinition = {
  type: FurnitureType;
  footprint: {
    cols: number;
    rows: number;
  };
  surfaces: FurnitureSurface[];
  defaultScale: number;
  blocksPlacement: boolean;
};

export type PotPlacement = {
  x: number;
  y: number;
  scale: number;
  depth: number;
};

export const ROOM_LAYOUT = {
  backWall: [
    { x: 170, y: 110 },
    { x: 1110, y: 110 },
    { x: 1110, y: 405 },
    { x: 170, y: 405 }
  ],
  leftWall: [
    { x: 0, y: 210 },
    { x: 170, y: 110 },
    { x: 170, y: 405 },
    { x: 0, y: 720 }
  ],
  rightWall: [
    { x: 1110, y: 110 },
    { x: 1280, y: 210 },
    { x: 1280, y: 720 },
    { x: 1110, y: 405 }
  ],
  floor: [
    { x: 170, y: 405 },
    { x: 1110, y: 405 },
    { x: 1280, y: 720 },
    { x: 0, y: 720 }
  ],
  floorBounds: { x: 0, y: 405, width: 1280, height: 315 },
  windowPoint: { x: 640, y: 255 },
  balconyPoint: { x: 640, y: 363 },
  quietPoint: { x: 820, y: 500 },
  indoorPotPoint: { x: 900, y: 560 },
  balconyPotPoint: { x: 735, y: 398 },
  petStartPoint: { x: 610, y: 610 }
} as const;

export const DEFAULT_ROOM_SURFACE_THEME: RoomSurfaceTheme = {
  wallpaper: {
    key: "room_wallpaper_mint_cream",
    size: 64,
    baseColor: 0xfff5df,
    stripeColor: 0xf3e4c8,
    dotColor: 0xb8d8b1,
    alpha: 1,
    wallAngles: {
      back: 0,
      left: -30,
      right: 30
    }
  },
  flooring: {
    key: "room_flooring_light_plank",
    width: 120,
    height: 72,
    baseColor: 0xeacb98,
    plankColor: 0xd6aa72,
    grainColor: 0xf5dfb6,
    alpha: 1,
    angle: 0
  },
  trimColor: 0x9ecf9b,
  shadowColor: 0x8a6f51,
  shadowAlpha: 0.16
};

export const furniturePlacementDefinitions: Record<FurnitureType, FurniturePlacementDefinition> = {
  [FurnitureType.Bed]: { type: FurnitureType.Bed, footprint: { cols: 3, rows: 2 }, surfaces: ["floor"], defaultScale: 1.08, blocksPlacement: true },
  [FurnitureType.Chair]: { type: FurnitureType.Chair, footprint: { cols: 1, rows: 1 }, surfaces: ["floor"], defaultScale: 1.06, blocksPlacement: true },
  [FurnitureType.Desk]: { type: FurnitureType.Desk, footprint: { cols: 3, rows: 2 }, surfaces: ["floor"], defaultScale: 1.06, blocksPlacement: true },
  [FurnitureType.ExerciseEquipment]: { type: FurnitureType.ExerciseEquipment, footprint: { cols: 2, rows: 2 }, surfaces: ["floor"], defaultScale: 1, blocksPlacement: true },
  [FurnitureType.FoodBowl]: { type: FurnitureType.FoodBowl, footprint: { cols: 1, rows: 1 }, surfaces: ["floor"], defaultScale: 1, blocksPlacement: true },
  [FurnitureType.Toy]: { type: FurnitureType.Toy, footprint: { cols: 1, rows: 1 }, surfaces: ["floor"], defaultScale: 1, blocksPlacement: true },
  [FurnitureType.Pot]: { type: FurnitureType.Pot, footprint: { cols: 1, rows: 1 }, surfaces: ["floor"], defaultScale: 0.72, blocksPlacement: true },
  [FurnitureType.Sofa]: { type: FurnitureType.Sofa, footprint: { cols: 3, rows: 2 }, surfaces: ["floor"], defaultScale: 1.06, blocksPlacement: true },
  [FurnitureType.Bookshelf]: { type: FurnitureType.Bookshelf, footprint: { cols: 2, rows: 2 }, surfaces: ["floor"], defaultScale: 1, blocksPlacement: true },
  [FurnitureType.Wardrobe]: { type: FurnitureType.Wardrobe, footprint: { cols: 2, rows: 2 }, surfaces: ["floor"], defaultScale: 1.04, blocksPlacement: true },
  [FurnitureType.Decoration]: { type: FurnitureType.Decoration, footprint: { cols: 2, rows: 2 }, surfaces: ["wall"], defaultScale: 0.9, blocksPlacement: false },
  [FurnitureType.Rug]: { type: FurnitureType.Rug, footprint: { cols: 3, rows: 2 }, surfaces: ["floor"], defaultScale: 1, blocksPlacement: false },
  [FurnitureType.Painting]: { type: FurnitureType.Painting, footprint: { cols: 2, rows: 1 }, surfaces: ["wall"], defaultScale: 0.9, blocksPlacement: false },
  [FurnitureType.CoffeeTable]: { type: FurnitureType.CoffeeTable, footprint: { cols: 2, rows: 1 }, surfaces: ["floor"], defaultScale: 1, blocksPlacement: true },
  [FurnitureType.TvCabinet]: { type: FurnitureType.TvCabinet, footprint: { cols: 2, rows: 2 }, surfaces: ["floor"], defaultScale: 1, blocksPlacement: true }
};

export const roomGridCells: FurnitureGridCell[] = createRoomGridCells();

const defaultFurniturePlacements: Array<{ id: string; type: FurnitureType; cell: string; rotation?: number; interactable?: boolean }> = [
  { id: "bed_1", type: FurnitureType.Bed, cell: "floor-0-1", rotation: -30 },
  { id: "sofa_1", type: FurnitureType.Sofa, cell: "floor-2-6", rotation: 30 },
  { id: "desk_1", type: FurnitureType.Desk, cell: "floor-0-6", rotation: 30 },
  { id: "chair_1", type: FurnitureType.Chair, cell: "floor-2-5", rotation: 30 },
  { id: "rug_1", type: FurnitureType.Rug, cell: "floor-3-4", interactable: false },
  { id: "painting_1", type: FurnitureType.Painting, cell: "wall-back-1-1", interactable: false },
  { id: "bookshelf_1", type: FurnitureType.Bookshelf, cell: "floor-0-2", rotation: -30 },
  { id: "treadmill_1", type: FurnitureType.ExerciseEquipment, cell: "floor-2-7", rotation: 30 },
  { id: "tv_cabinet_1", type: FurnitureType.TvCabinet, cell: "floor-1-5", rotation: 30 },
  { id: "wardrobe_1", type: FurnitureType.Wardrobe, cell: "floor-0-8", rotation: 30 },
  { id: "plant_1", type: FurnitureType.Pot, cell: "floor-2-2" },
  { id: "coffee_table_1", type: FurnitureType.CoffeeTable, cell: "floor-3-5" }
];

const legacyDefaultFurniturePlacements: Array<{ id: string; type: FurnitureType; cell: string; rotation?: number; interactable?: boolean }> = [
  { id: "bed_1", type: FurnitureType.Bed, cell: "floor-0-1" },
  { id: "desk_1", type: FurnitureType.Desk, cell: "floor-0-5" },
  { id: "wardrobe_1", type: FurnitureType.Wardrobe, cell: "floor-0-8" },
  { id: "chair_1", type: FurnitureType.Chair, cell: "floor-2-5" },
  { id: "sofa_1", type: FurnitureType.Sofa, cell: "floor-3-4" },
  { id: "wall_picture_1", type: FurnitureType.Decoration, cell: "wall-back-1-1", interactable: false }
];

export const singleFloorFurnitureItems: FurnitureSaveData[] = defaultFurniturePlacements.map((placement) =>
  createFurnitureSaveData(placement.id, placement.type, placement.cell, placement.rotation ?? 0, placement.interactable ?? true)
);

export const singleFloorStoredFurnitureItems: FurnitureSaveData[] = singleFloorFurnitureItems.map((item) => storeFurnitureItem(item));

const legacySingleFloorFurnitureItems: FurnitureSaveData[] = legacyDefaultFurniturePlacements.map((placement) =>
  createFurnitureSaveData(placement.id, placement.type, placement.cell, placement.rotation ?? 0, placement.interactable ?? true)
);

export function createRoomGridCells(): FurnitureGridCell[] {
  const cells: FurnitureGridCell[] = [];
  const floorRows = 5;
  const floorCols = 9;
  for (let row = 0; row < floorRows; row++) {
    const topT = row / floorRows;
    const bottomT = (row + 1) / floorRows;
    const centerT = (row + 0.5) / floorRows;
    const topLeft = floorEdgePoint(topT, "left");
    const topRight = floorEdgePoint(topT, "right");
    const bottomLeft = floorEdgePoint(bottomT, "left");
    const bottomRight = floorEdgePoint(bottomT, "right");
    const centerLeft = floorEdgePoint(centerT, "left");
    const centerRight = floorEdgePoint(centerT, "right");
    for (let col = 0; col < floorCols; col++) {
      const leftU = col / floorCols;
      const rightU = (col + 1) / floorCols;
      const centerU = (col + 0.5) / floorCols;
      cells.push({
        id: `floor-${row}-${col}`,
        surface: "floor",
        row,
        col,
        x: lerp(centerLeft.x, centerRight.x, centerU),
        y: lerp(centerLeft.y, centerRight.y, centerU),
        polygon: [
          interpolate(topLeft, topRight, leftU),
          interpolate(topLeft, topRight, rightU),
          interpolate(bottomLeft, bottomRight, rightU),
          interpolate(bottomLeft, bottomRight, leftU)
        ]
      });
    }
  }

  cells.push(...createWallCells("wall-back", "wall", 170, 110, 940, 295, 9, 3, new Set(["wall-back-0-3", "wall-back-0-4", "wall-back-0-5", "wall-back-1-3", "wall-back-1-4", "wall-back-1-5", "wall-back-2-4"])));
  cells.push(...createWallCells("wall-left", "wall", 18, 236, 138, 354, 2, 3));
  cells.push(...createWallCells("wall-right", "wall", 1124, 236, 138, 354, 2, 3));
  return cells;
}

export function createFurnitureSaveData(id: string, type: FurnitureType, gridCellId: string, rotation = 0, interactable = true): FurnitureSaveData {
  const cell = getGridCell(gridCellId) ?? getFirstAvailableCellForType(type);
  const definition = furniturePlacementDefinitions[type];
  return {
    id,
    type,
    floorId: 1,
    x: cell.x,
    y: cell.y,
    scale: definition.defaultScale,
    rotation,
    interactable,
    isPlaced: true,
    surface: cell.surface,
    gridCellId: cell.id
  };
}

export function storeFurnitureItem(item: FurnitureSaveData): FurnitureSaveData {
  return {
    ...item,
    x: -1000,
    y: -1000,
    isPlaced: false,
    gridCellId: ""
  };
}

export function isDefaultPlacedFurnitureLayout(items?: Partial<FurnitureSaveData>[]): boolean {
  return matchesDefaultPlacedLayout(items, singleFloorFurnitureItems) || matchesDefaultPlacedLayout(items, legacySingleFloorFurnitureItems);
}

function matchesDefaultPlacedLayout(items: Partial<FurnitureSaveData>[] | undefined, defaults: FurnitureSaveData[]): boolean {
  if (!items || items.length !== defaults.length) return false;
  return defaults.every((defaultItem) => {
    const item = items.find((candidate) => candidate.id === defaultItem.id);
    if (!item || item.isPlaced === false) return false;
    return item.type === defaultItem.type && item.gridCellId === defaultItem.gridCellId && normalizeRotation(item.rotation ?? 0) === normalizeRotation(defaultItem.rotation);
  });
}

export function getPotPlacementForStage(stage: GrowthStage): PotPlacement {
  if (stage === GrowthStage.SeedInPot) {
    return {
      x: ROOM_LAYOUT.indoorPotPoint.x,
      y: ROOM_LAYOUT.indoorPotPoint.y,
      scale: 0.86,
      depth: Math.floor(ROOM_LAYOUT.indoorPotPoint.y)
    };
  }
  return {
    x: ROOM_LAYOUT.balconyPotPoint.x,
    y: ROOM_LAYOUT.balconyPotPoint.y,
    scale: 0.42,
    depth: -62
  };
}

export function getGridCell(id?: string): FurnitureGridCell | undefined {
  if (!id) return undefined;
  return roomGridCells.find((cell) => cell.id === id);
}

export function getNearestGridCell(point: RoomPoint, surfaces?: FurnitureSurface[], includeBlocked = false): FurnitureGridCell | undefined {
  const candidates = roomGridCells.filter((cell) => (!surfaces || surfaces.includes(cell.surface)) && (includeBlocked || !cell.blocked));
  let nearest: FurnitureGridCell | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const cell of candidates) {
    const distance = Math.hypot(cell.x - point.x, cell.y - point.y);
    if (distance < nearestDistance) {
      nearest = cell;
      nearestDistance = distance;
    }
  }
  return nearest;
}

export function getOccupiedGridCellIds(item: Pick<FurnitureSaveData, "gridCellId" | "type" | "isPlaced">): string[] {
  if (item.isPlaced === false) return [];
  const anchor = getGridCell(item.gridCellId);
  if (!anchor) return [];
  const definition = furniturePlacementDefinitions[item.type];
  if (!definition.blocksPlacement) return [];
  const prefix = getCellIdPrefix(anchor.id);
  const ids: string[] = [];
  const startCol = anchor.col - Math.floor(definition.footprint.cols / 2);
  const endCol = startCol + definition.footprint.cols - 1;
  const startRow = anchor.row;
  const endRow = anchor.row + definition.footprint.rows - 1;
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      ids.push(`${prefix}-${row}-${col}`);
    }
  }
  return ids;
}

export function canPlaceFurnitureAtCell(item: FurnitureSaveData, gridCellId: string, items: FurnitureSaveData[], stage: GrowthStage): boolean {
  const cell = getGridCell(gridCellId);
  if (!cell || cell.blocked) return false;
  const definition = furniturePlacementDefinitions[item.type];
  if (!definition.surfaces.includes(cell.surface)) return false;
  const candidate = { ...item, gridCellId, surface: cell.surface, isPlaced: true };
  const fixedBlockers = new Set(getFixedStructureBlockedCellIds(stage));
  if (!definition.blocksPlacement) return !fixedBlockers.has(cell.id);
  const occupiedByOthers = new Set(
    items
      .filter((other) => other.id !== item.id && other.isPlaced !== false)
      .flatMap((other) => getOccupiedGridCellIds(other))
  );
  for (const occupied of getOccupiedGridCellIds(candidate)) {
    const occupiedCell = getGridCell(occupied);
    if (!occupiedCell || occupiedCell.surface !== cell.surface || occupiedCell.blocked || fixedBlockers.has(occupied)) return false;
    if (occupiedByOthers.has(occupied)) return false;
  }
  return true;
}

export function applyFurnitureCell(item: FurnitureSaveData, gridCellId: string): FurnitureSaveData {
  const cell = getGridCell(gridCellId) ?? getFirstAvailableCellForType(item.type);
  item.gridCellId = cell.id;
  item.surface = cell.surface;
  item.x = cell.x;
  item.y = cell.y;
  item.floorId = 1;
  item.isPlaced = true;
  return item;
}

export function rotateFurniture(item: FurnitureSaveData, direction: -1 | 1): void {
  const options = [-30, 0, 30] as const;
  const current = normalizeFurnitureRotationDegrees(item.rotation);
  const nearestIndex = options.reduce((best, option, index) => {
    return Math.abs(option - current) < Math.abs(options[best] - current) ? index : best;
  }, 1);
  const nextIndex = (nearestIndex + direction + options.length) % options.length;
  item.rotation = options[nextIndex];
}

export function getFixedStructureBlockedCellIds(stage: GrowthStage): string[] {
  const blockers = ["wall-back-0-3", "wall-back-0-4", "wall-back-0-5", "wall-back-1-3", "wall-back-1-4", "wall-back-1-5", "wall-back-2-4"];
  if (stage === GrowthStage.SeedInPot) {
    blockers.push("floor-2-6");
  }
  return blockers;
}

export function pointInPolygon(point: RoomPoint, polygon: readonly RoomPoint[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const current = polygon[i];
    const previous = polygon[j];
    const crossesY = current.y > point.y !== previous.y > point.y;
    if (!crossesY) continue;
    const xAtY = ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) + current.x;
    if (point.x < xAtY) inside = !inside;
  }
  return inside;
}

export function floorTopYAtX(x: number): number {
  if (x < 170) return 720 - (315 * x) / 170;
  if (x > 1110) return 405 + (315 * (x - 1110)) / 170;
  return 405;
}

export function clampPointToSingleFloor(point: RoomPoint, margin = 34): RoomPoint {
  const x = clamp(point.x, margin, 1280 - margin);
  const minY = floorTopYAtX(x) + margin;
  const y = clamp(point.y, minY, 720 - margin);
  return { x, y };
}

export function normalizeSingleFloorFurniture(items?: Partial<FurnitureSaveData>[], stage = GrowthStage.SeedInPot, resetPlacement = false): FurnitureSaveData[] {
  const byId = new Map((items ?? []).map((item) => [item.id, item]));
  const normalized = singleFloorStoredFurnitureItems.map((defaultItem) => {
    const placedDefault = singleFloorFurnitureItems.find((item) => item.id === defaultItem.id) ?? defaultItem;
    const existing = byId.get(defaultItem.id);
    const source = existing ? { ...defaultItem, ...existing } : { ...defaultItem };
    const definition = furniturePlacementDefinitions[source.type];
    const isPlaced = source.isPlaced ?? defaultItem.isPlaced;
    const nearestCell = isPlaced === false
      ? undefined
      : resetPlacement
      ? getGridCell(placedDefault.gridCellId)
      : source.gridCellId
      ? getGridCell(source.gridCellId)
      : getNearestGridCell({ x: source.x ?? placedDefault.x, y: source.y ?? placedDefault.y }, definition.surfaces);
    const item: FurnitureSaveData = {
      ...placedDefault,
      ...source,
      floorId: 1,
      interactable: source.interactable ?? defaultItem.interactable,
      isPlaced,
      surface: nearestCell?.surface ?? source.surface ?? placedDefault.surface,
      gridCellId: nearestCell?.id ?? (isPlaced === false ? "" : placedDefault.gridCellId),
      rotation: normalizeRotation(source.rotation ?? defaultItem.rotation),
      scale: definition.defaultScale
    };
    if (item.isPlaced === false) {
      item.x = -1000;
      item.y = -1000;
      item.gridCellId = "";
    }
    if (item.isPlaced !== false) applyFurnitureCell(item, item.gridCellId);
    return item;
  });
  const defaultIds = new Set(singleFloorStoredFurnitureItems.map((item) => item.id));
  for (const existing of items ?? []) {
    if (!existing.id || defaultIds.has(existing.id) || !existing.type || !furniturePlacementDefinitions[existing.type]) continue;
    const definition = furniturePlacementDefinitions[existing.type];
    const isPlaced = existing.isPlaced ?? true;
    const fallbackCell = getFirstAvailableCellForType(existing.type);
    const nearestCell = isPlaced === false
      ? undefined
      : existing.gridCellId
      ? getGridCell(existing.gridCellId)
      : getNearestGridCell({ x: existing.x ?? fallbackCell.x, y: existing.y ?? fallbackCell.y }, definition.surfaces);
    const item: FurnitureSaveData = {
      id: existing.id,
      type: existing.type,
      floorId: 1,
      x: existing.x ?? fallbackCell.x,
      y: existing.y ?? fallbackCell.y,
      scale: definition.defaultScale,
      rotation: normalizeRotation(existing.rotation ?? 0),
      interactable: existing.interactable ?? true,
      isPlaced,
      surface: nearestCell?.surface ?? existing.surface ?? fallbackCell.surface,
      gridCellId: nearestCell?.id ?? (isPlaced === false ? "" : fallbackCell.id)
    };
    if (item.isPlaced === false) {
      item.x = -1000;
      item.y = -1000;
      item.gridCellId = "";
    }
    if (item.isPlaced !== false) applyFurnitureCell(item, item.gridCellId);
    normalized.push(item);
  }

  for (const item of normalized) {
    if (item.isPlaced === false) continue;
    if (!canPlaceFurnitureAtCell(item, item.gridCellId, normalized, stage)) {
      const fallback = findFirstAvailableCell(item, normalized, stage);
      if (fallback) applyFurnitureCell(item, fallback.id);
    }
  }
  return normalized;
}

export function cloneFurnitureItems(items: FurnitureSaveData[]): FurnitureSaveData[] {
  return items.map((item) => ({ ...item }));
}

export function findFirstAvailableCell(item: FurnitureSaveData, items: FurnitureSaveData[], stage: GrowthStage): FurnitureGridCell | undefined {
  const definition = furniturePlacementDefinitions[item.type];
  return roomGridCells.find((cell) => definition.surfaces.includes(cell.surface) && canPlaceFurnitureAtCell(item, cell.id, items, stage));
}

function getFirstAvailableCellForType(type: FurnitureType): FurnitureGridCell {
  const definition = furniturePlacementDefinitions[type];
  return roomGridCells.find((cell) => definition.surfaces.includes(cell.surface) && !cell.blocked) ?? roomGridCells[0];
}

function createWallCells(
  prefix: string,
  surface: FurnitureSurface,
  x: number,
  y: number,
  width: number,
  height: number,
  cols: number,
  rows: number,
  blocked = new Set<string>()
): FurnitureGridCell[] {
  const cells: FurnitureGridCell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const id = `${prefix}-${row}-${col}`;
      const left = x + (width * col) / cols;
      const top = y + (height * row) / rows;
      const right = x + (width * (col + 1)) / cols;
      const bottom = y + (height * (row + 1)) / rows;
      cells.push({
        id,
        surface,
        row,
        col,
        x: (left + right) / 2,
        y: (top + bottom) / 2,
        polygon: [
          { x: left, y: top },
          { x: right, y: top },
          { x: right, y: bottom },
          { x: left, y: bottom }
        ],
        blocked: blocked.has(id)
      });
    }
  }
  return cells;
}

function floorEdgePoint(t: number, side: "left" | "right"): RoomPoint {
  if (side === "left") return interpolate({ x: 170, y: 405 }, { x: 0, y: 720 }, t);
  return interpolate({ x: 1110, y: 405 }, { x: 1280, y: 720 }, t);
}

function interpolate(a: RoomPoint, b: RoomPoint, t: number): RoomPoint {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t)
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeRotation(rotation: number): number {
  return normalizeFurnitureRotationDegrees(rotation);
}

function getCellIdPrefix(id: string): string {
  const parts = id.split("-");
  return parts.length >= 4 ? `${parts[0]}-${parts[1]}` : parts[0];
}
