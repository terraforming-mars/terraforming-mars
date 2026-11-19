import {BonusCardId, CubeType} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {whiteTrackCubes} from '@/server/automa/corps/corpHelpers';

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
      marsBot.game.log('MarsBot (${0}): building track advance, +1:r:mc: on card (${1} total)', (b) => b.cardName(this.name).number(mc));
    }
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    marsBot.addBonusCardToActionDeck(BonusCardId.B24_SUPPLY_AND_DEMAND);
  }
}
