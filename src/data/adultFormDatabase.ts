import { AdultFormDefinition } from "./types";

export const IAN_ADULT_FORM_ID = "ian_adult";

export const adultFormDatabase: AdultFormDefinition[] = [
  {
    formId: IAN_ADULT_FORM_ID,
    formName: "Ian 成年体",
    description: "它长出了像宝石伞盖一样的成年姿态，会在小屋里散步、休息，也会认真回应你的点击。",
    personalityTags: ["comfort", "accompany", "curious", "healing"],
    spriteBasePath: "pet/adult/ian",
    reasonTemplate: "这几天的陪伴让它长成了 Ian 的成年模样，带着柔软的光和一点好奇心留在你身边。",
    scoreTags: ["comfort", "accompany", "curious", "healing", "growth"]
  },
  {
    formId: "quiet_reader",
    formName: "静读成年体",
    description: "它变得安静又专注，喜欢在书架和椅子旁停留，像是在替你守着一段慢下来的时间。",
    personalityTags: ["read", "quiet", "growth", "accompany"],
    spriteBasePath: "pet/adult/quiet_reader",
    reasonTemplate: "它记住了你那些关于学习、阅读和安静陪伴的选择，于是长成了更适合静静相处的样子。",
    scoreTags: ["read", "quiet", "growth", "accompany"]
  },
  {
    formId: "active_sport",
    formName: "活力成年体",
    description: "它的步子更轻快，常常想去运动器材和玩具旁转一转，给小屋带来明亮的动感。",
    personalityTags: ["exercise", "active", "happy"],
    spriteBasePath: "pet/adult/active_sport",
    reasonTemplate: "那些关于运动、开心和主动探索的回答，把它养成了更有活力的成年体。",
    scoreTags: ["exercise", "active", "happy"]
  },
  {
    formId: "craft_maker",
    formName: "手作成年体",
    description: "它对桌边的小材料格外上心，像是随时会把一天里的心情做成一件小礼物。",
    personalityTags: ["craft", "curious", "happy"],
    spriteBasePath: "pet/adult/craft_maker",
    reasonTemplate: "它收下了你关于制作、礼物和小心思的偏好，于是长成了爱动手的样子。",
    scoreTags: ["craft", "curious", "happy"]
  },
  {
    formId: "travel_explorer",
    formName: "远行成年体",
    description: "它总会望向窗外，像把远方的风景藏进了小屋，偶尔也会带回旅途里的小东西。",
    personalityTags: ["travel", "curious", "active"],
    spriteBasePath: "pet/adult/travel_explorer",
    reasonTemplate: "你提到的远方、风景和发现新东西，让它长成了更想出门看看的形态。",
    scoreTags: ["travel", "curious", "active"]
  },
  {
    formId: "sleepy_soft",
    formName: "软眠成年体",
    description: "它变得柔软又会照顾自己，喜欢靠近床和沙发，把休息这件事做得很认真。",
    personalityTags: ["sleep", "rest", "comfort", "quiet"],
    spriteBasePath: "pet/adult/sleepy_soft",
    reasonTemplate: "那些关于休息、疲惫和被温柔接住的时刻，让它长成了更会安放情绪的样子。",
    scoreTags: ["sleep", "rest", "comfort", "quiet"]
  },
  {
    formId: "healing_companion",
    formName: "疗愈成年体",
    description: "它像一盏小小的暖灯，会把你的情绪放得很轻，也更愿意待在你身边。",
    personalityTags: ["comfort", "healing", "accompany"],
    spriteBasePath: "pet/adult/healing_companion",
    reasonTemplate: "它记住了你需要陪伴、安慰和一点点被理解的时候，于是长成了温柔守候的模样。",
    scoreTags: ["comfort", "healing", "accompany"]
  }
];
