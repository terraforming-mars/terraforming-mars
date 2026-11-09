import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {whiteTrackCubes, bonusCardBeforeActionPhase} from '@/server/automa/corps/BaseGameCorps';

// C20 Factorum
export const FACTORUM_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.FACTORUM,
  description: 'Tag: Power. White cubes on building track: each advance stores 1 MC on card. Each generation: add Supply and Demand to action deck.',
  tags: [Tag.POWER],
  trackCubes: whiteTrackCubes(0),
  trackCubesTriggerEveryAdvance: true,
  effect: {
    onTrackCubeTrigger(marsBot, trackIndex, _position, cubeType) {
      if (cubeType === 'white' && trackIndex === 0) {
        const mc = marsBot.getCorpState('mcOnCard') + 1;
        marsBot.setCorpState('mcOnCard', mc);
        marsBot.game.log(`MarsBot (Factorum): building track advance, +1 M€ on card (${mc} total)`);
      }
    },
  },
  ...bonusCardBeforeActionPhase(BonusCardId.B24_SUPPLY_AND_DEMAND, 'Factorum'),
};
