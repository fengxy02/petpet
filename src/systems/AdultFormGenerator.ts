import { adultFormDatabase } from "../data/adultFormDatabase";
import { AdultFormData, AdultFormDefinition, FurnitureType, SaveData } from "../data/types";

export class AdultFormGenerator {
  static generate(save: SaveData): AdultFormData {
    const scores = this.score(save);
    const best = this.pickBest(scores, save);
    return this.toData(best, scores);
  }

  static fromPreference(formId: string): AdultFormData {
    return this.toData(adultFormDatabase.find((form) => form.formId === formId) ?? adultFormDatabase[0]);
  }

  static hasForm(formId: string): boolean {
    return adultFormDatabase.some((form) => form.formId === formId);
  }

  static score(save: SaveData): Record<string, number> {
    const scores: Record<string, number> = {
      read: 0,
      exercise: 0,
      comfort: 0,
      craft: 0,
      travel: 0,
      sleep: 0,
      accompany: 0,
      active: 0,
      quiet: 0,
      growth: 0,
      happy: 0,
      rest: 0,
      curious: 0,
      healing: 0
    };
    for (const letter of save.letters) {
      for (const tag of letter.extractedTags) scores[tag] = (scores[tag] ?? 0) + 2;
    }
    for (const summary of save.summaries) {
      for (const tag of summary.tags) scores[tag] = (scores[tag] ?? 0) + 1;
    }
    for (const [tag, value] of Object.entries(save.preferences.tags)) {
      scores[tag] = (scores[tag] ?? 0) + value;
    }
    for (const record of save.interactionRecords) {
      if (record.furnitureType === FurnitureType.Chair || record.furnitureType === FurnitureType.Bookshelf) scores.read += 1;
      if (record.furnitureType === FurnitureType.ExerciseEquipment) scores.exercise += 1;
      if (record.furnitureType === FurnitureType.Desk) scores.craft += 1;
      if (record.furnitureType === FurnitureType.Bed || record.furnitureType === FurnitureType.Sofa) scores.sleep += 1;
    }
    for (const item of save.collections) {
      if (item.type === "postcard") scores.travel += 2;
      if (item.type === "craft") scores.craft += 2;
    }
    return scores;
  }

  private static pickBest(scores: Record<string, number>, save: SaveData): AdultFormDefinition {
    if (save.letters.length === 0 && save.preferences.answers.length === 0 && save.interactionRecords.length < 2) {
      return adultFormDatabase[0];
    }
    let best = adultFormDatabase[0];
    let bestScore = -Infinity;
    for (const form of adultFormDatabase) {
      const score = form.scoreTags.reduce((sum, tag) => sum + (scores[tag] ?? 0), 0);
      if (score > bestScore) {
        best = form;
        bestScore = score;
      }
    }
    return best;
  }

  private static toData(form: AdultFormDefinition, scores?: Record<string, number>): AdultFormData {
    return {
      formId: form.formId,
      formName: form.formName,
      description: form.description,
      personalityTags: form.personalityTags,
      spriteBasePath: form.spriteBasePath,
      reason: this.buildReason(form, scores)
    };
  }

  private static buildReason(form: AdultFormDefinition, scores?: Record<string, number>): string {
    if (!scores) return form.reasonTemplate;
    const topLabels = form.scoreTags
      .map((tag) => ({ tag, score: scores[tag] ?? 0 }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((item) => tagLabels[item.tag] ?? item.tag);
    if (topLabels.length === 0) return form.reasonTemplate;
    return `${form.reasonTemplate} 它尤其记住了${topLabels.join("、")}这些痕迹。`;
  }
}

const tagLabels: Record<string, string> = {
  read: "安静读写",
  exercise: "运动活力",
  comfort: "被安慰的时刻",
  craft: "手作礼物",
  travel: "远方和风景",
  sleep: "好好休息",
  accompany: "陪伴",
  active: "主动探索",
  quiet: "安静相处",
  growth: "一起成长",
  happy: "开心回应",
  rest: "放松",
  curious: "好奇心",
  healing: "温柔疗愈"
};
