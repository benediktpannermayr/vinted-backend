import type { ItemCondition } from '@prisma/client';

const CONDITION_MAP: Record<string, ItemCondition> = {
  'neu mit etikett': 'NEW_WITH_TAGS',
  'new with tags': 'NEW_WITH_TAGS',
  'neu ohne etikett': 'NEW_WITHOUT_TAGS',
  'new without tags': 'NEW_WITHOUT_TAGS',
  'sehr gut': 'VERY_GOOD',
  'very good': 'VERY_GOOD',
  gut: 'GOOD',
  good: 'GOOD',
  zufriedenstellend: 'SATISFACTORY',
  satisfactory: 'SATISFACTORY',
};

export function mapVintedConditionLabel(
  raw: string | null,
): ItemCondition | null {
  if (!raw) return null;
  return CONDITION_MAP[raw.trim().toLowerCase()] ?? null;
}
