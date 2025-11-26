import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {all} from '@/server/cards/Options';

export class SpacePortColony extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 27,
      tags: [Tag.SPACE],
      name: CardName.SPACE_PORT_COLONY,
      type: CardType.AUTOMATED,

      requirements: {colonies: 1},
      victoryPoints: {colonies: {colonies: {}}, all, per: 2},

      behavior: {
        colonies: {
          buildColony: {allowDuplicates: true},
          addTradeFleet: 1,
        },
      },

      metadata: {
        cardNumber: 'C40',
        renderData: CardRenderer.builder((b) => {
          b.colonies(1).asterix().nbsp.tradeFleet().br;
          b.vpText('1 VP per 2 colonies in play.');
        }),
        description: 'Requires a colony. Place a colony. MAY BE PLACED ON A COLONY TILE WHERE YOU ALREADY HAVE A COLONY. Gain 1 Trade Fleet.',
      },
    });
  }

  public override getVictoryPoints(player: IPlayer) {
    let coloniesCount = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.length;
    });
    return Math.floor(coloniesCount / 2);
  }
}
