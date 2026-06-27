import { questionDatabase } from "../data/questionDatabase";
import { QuestionData, QuestionOption, SaveData } from "../data/types";

export class PreferenceSystem {
  static shouldAskToday(save: SaveData): boolean {
    if (save.dayCount < 3) return false;
    if (save.dayCount === 7 && !save.adultFormGenerated) return false;
    if (this.hasAnsweredToday(save)) return false;
    if (this.getNextQuestion(save) === null) return false;
    if (save.dayCount <= 6) return true;
    return Math.random() < 0.45;
  }

  static hasAnsweredToday(save: SaveData): boolean {
    return save.preferences.answers.some((answer) => answer.day === save.dayCount);
  }

  static getNextQuestion(save: SaveData): QuestionData | null {
    return questionDatabase.find((question) => !save.preferences.answers.some((answer) => answer.questionId === question.id)) ?? null;
  }

  static applyAnswer(save: SaveData, question: QuestionData, option: QuestionOption): void {
    save.preferences.answers.push({
      questionId: question.id,
      answerId: option.id,
      label: option.label,
      tags: option.tags,
      day: save.dayCount,
      createdAt: new Date().toISOString()
    });
    for (const tag of option.tags) {
      save.preferences.tags[tag] = (save.preferences.tags[tag] ?? 0) + 2;
    }
  }
}
