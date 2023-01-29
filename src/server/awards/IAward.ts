import {AwardName} from '../../common/ma/AwardName';
import {Player} from '../Player';

import {CardName} from '../../common/cards/CardName';
import {ASIMOV_AWARD_BONUS} from '../../common/constants';

export interface IAward {
  name: AwardName;
  description: string;
  getScore: (player: Player) => number;
}

export function getAdditionalScore(player: Player): number {
  let score = 0;
  if (player.cardIsInEffect(CardName.ASIMOV)) score += ASIMOV_AWARD_BONUS;
  return score;
}
