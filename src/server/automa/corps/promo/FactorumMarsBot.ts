import {BonusCardId, CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {whiteTrackCubes, addBonusCardBeforeActionPhase} from '@/server/automa/corps/BaseGameCorps';

export class FactorumMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.FACTORUM,
      description: 'Tag: Power. White cubes on building track: each advance stores 1 M€ on card. Each generation: add Supply and Demand to action deck.',
      tags: [Tag.POWER],
      actionDeckBonusCard: BonusCardId.B24_SUPPLY_AND_DEMAND,
      trackCubes: whiteTrackCubes(0),
      trackCubesTriggerEveryAdvance: true,
    });
  }

  public override onTrackCubeTrigger(marsBot: IMarsBot, trackIndex: number, _position: number, cubeType: CubeType): void {
    if (cubeType === 'white' && trackIndex === 0) {
      const mc = marsBot.getCorpState('mcOnCard') + 1;
      marsBot.setCorpState('mcOnCard', mc);
      marsBot.game.log(`MarsBot (Factorum): building track advance, +1 M€ on card (${mc} total)`);
    }
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    addBonusCardBeforeActionPhase(marsBot, BonusCardId.B24_SUPPLY_AND_DEMAND, 'Factorum');
  }
}
