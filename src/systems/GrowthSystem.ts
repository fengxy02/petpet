import { GrowthStage, SaveData } from "../data/types";
import { AssetKeys } from "../utils/AssetKeys";

export class GrowthSystem {
  static getStageForDay(day: number): GrowthStage {
    if (day <= 1) return GrowthStage.SeedInPot;
    if (day === 2) return GrowthStage.SproutSmall;
    if (day === 3) return GrowthStage.SproutGrowing;
    if (day >= 4 && day <= 6) return GrowthStage.BabyPet;
    return GrowthStage.AdultPet;
  }

  static updateSaveGrowth(save: SaveData): void {
    save.growthStage = this.getStageForDay(save.dayCount);
    save.pot.currentTextureKey = this.getPotTextureForStage(save.growthStage);
  }

  static getPotTextureForStage(stage: GrowthStage): string {
    switch (stage) {
      case GrowthStage.SeedInPot:
        return AssetKeys.Growth.PotSoil;
      case GrowthStage.SproutSmall:
        return AssetKeys.Growth.PotSproutSmall;
      case GrowthStage.SproutGrowing:
      case GrowthStage.BabyPet:
      case GrowthStage.AdultPet:
        return AssetKeys.Growth.PotSproutGrowing;
      default:
        return AssetKeys.Growth.PotEmpty;
    }
  }
}
