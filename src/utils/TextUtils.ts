export function stageLabel(stage: string): string {
  const labels: Record<string, string> = {
    SeedInPot: "种子在土里",
    SproutSmall: "冒出小芽",
    SproutGrowing: "芽长大了",
    BabyPet: "幼年体",
    AdultPet: "成年体"
  };
  return labels[stage] ?? stage;
}

export function clampText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
