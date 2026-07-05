"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapVintedConditionLabel = mapVintedConditionLabel;
const CONDITION_MAP = {
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
function mapVintedConditionLabel(raw) {
    if (!raw)
        return null;
    return CONDITION_MAP[raw.trim().toLowerCase()] ?? null;
}
//# sourceMappingURL=vinted-condition.util.js.map