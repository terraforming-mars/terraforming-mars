import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {PartyName} from '../../../common/turmoil/PartyName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../../common/TileType';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';
import {Resource} from '../../../common/Resource';

export class HE3ProductionQuotas extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.HE3_PRODUCTION_QUOTAS,
      type: CardType.EVENT,
      tags: [Tag.MOON],
      cost: 10,

      behavior: {
        moon: {miningRate: 1},
      },

      requirements: [{party: PartyName.KELVINISTS}, {miningTiles: 1, all}],
      metadata: {
        description: 'Requires that Kelvinists are ruling or that you have 2 delegates there, and 1 mine tile on The Moon. ' +
        'Pay 1 steel per mine tile on The Moon to gain 4 heat per mine tile on The Moon. Raise the mining rate 1 step.',
        cardNumber: 'M57',
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(1).slash().moonMine({size: Size.SMALL, all})
            .colon().text('4').heat(1).slash().moonMine({size: Size.SMALL, all}).br;
          b.moonMiningRate();
        }),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    const moonTiles = MoonExpansion.spaces(player.game, TileType.MOON_MINE, {surfaceOnly: true});
    if (player.steel < moonTiles.length) {
      return false;
    }
    return true;
  }

  public override bespokePlay(player: IPlayer) {
    const moonTiles = MoonExpansion.spaces(player.game, TileType.MOON_MINE, {surfaceOnly: true});
    const steelSpent = moonTiles.length;
    const heatGained = moonTiles.length * 4;
    player.stock.deduct(Resource.STEEL, steelSpent);
    player.heat += heatGained;
    player.game.log('Player spent ${0} steel and gained ${1} heat', (b) => b.number(steelSpent).number(heatGained));
    return undefined;
  }
}
