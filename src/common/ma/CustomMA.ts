import {MilestoneName, milestoneNames} from './MilestoneName';
import {AwardName, awardNames} from './AwardName';
import {RandomMAOptionType} from './RandomMAOptionType';

/** Preselected milestones and awards. Only valid when randomMA is MANUAL. */
export type CustomMA = {
  milestones: ReadonlyArray<MilestoneName>;
  awards: ReadonlyArray<AwardName>;
};

/** The fewest milestones, and the fewest awards, a hand-picked selection may have. */
export const MIN_CUSTOM_GOALS = 3;
/** The most milestones, and the most awards, a hand-picked selection may have. */
export const MAX_CUSTOM_GOALS = 8;

/**
 * Throws an Error describing what's wrong with `customMA`, if anything.
 *
 * customMA is required when randomMA is MANUAL, and not allowed otherwise. It must have between MIN_CUSTOM_GOALS and
 * MAX_CUSTOM_GOALS milestones, and between MIN_CUSTOM_GOALS and MAX_CUSTOM_GOALS awards.
 */
export function validateCustomMA(customMA: CustomMA | undefined, randomMA: RandomMAOptionType): void {
  if (randomMA !== RandomMAOptionType.MANUAL) {
    if (customMA !== undefined) {
      throw new Error('customMA requires randomMA to be ' + RandomMAOptionType.MANUAL);
    }
    return;
  }
  // customMA may be null when it comes from untrusted JSON.
  if (customMA === undefined || customMA === null) {
    throw new Error('randomMA ' + RandomMAOptionType.MANUAL + ' requires customMA');
  }
  if (!Array.isArray(customMA.milestones) || !Array.isArray(customMA.awards)) {
    throw new Error('customMA requires milestones and awards arrays');
  }
  for (const name of customMA.milestones) {
    if (!milestoneNames.includes(name)) {
      throw new Error('Unknown milestone: ' + name);
    }
  }
  for (const name of customMA.awards) {
    if (!awardNames.includes(name)) {
      throw new Error('Unknown award: ' + name);
    }
  }
  if (new Set(customMA.milestones).size !== customMA.milestones.length) {
    throw new Error('customMA has duplicate milestones');
  }
  if (new Set(customMA.awards).size !== customMA.awards.length) {
    throw new Error('customMA has duplicate awards');
  }
  const inRange = (count: number) => count >= MIN_CUSTOM_GOALS && count <= MAX_CUSTOM_GOALS;
  if (!inRange(customMA.milestones.length)) {
    throw new Error(`You must have between ${MIN_CUSTOM_GOALS} and ${MAX_CUSTOM_GOALS} custom milestones`);
  }
  if (!inRange(customMA.awards.length)) {
    throw new Error(`You must have between ${MIN_CUSTOM_GOALS} and ${MAX_CUSTOM_GOALS} custom awards`);
  }
}
