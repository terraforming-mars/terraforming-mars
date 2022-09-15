import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../../common/turmoil/PartyName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../../common/TileType';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class HE3ProductionQuotas extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.HE3_PRODUCTION_QUOTAS,
      cardType: CardType.EVENT,
      tags: [Tag.MOON],
      cost: 10,

      behavior: {
        moon: {miningRate: 1},
      },

      requirements: CardRequirements.builder((b) => b.party(PartyName.KELVINISTS).miningTiles(1, {all})),
      metadata: {
        description: 'Requires that Kelvinists are ruling or that you have 2 delegates there, and 1 mine tile on The Moon. ' +
        'Pay 1 steel per mine tile on The Moon to gain 4 heat per mine tile on The Moon. Raise the Mining Rate 1 step.',
        cardNumber: 'M57',
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(1).slash().moonMine({size: Size.SMALL, all})
            .colon().text('4').heat(1).slash().moonMine({size: Size.SMALL, all}).br;
          b.moonMiningRate();
        }),
      },
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    const moonTiles = MoonExpansion.spaces(player.game, TileType.MOON_MINE, {surfaceOnly: true});
    if (player.steel < moonTiles.length) {
      return false;
    }
    return true;
  }

  public override bespokePlay(player: Player) {
    const moonTiles = MoonExpansion.spaces(player.game, TileType.MOON_MINE, {surfaceOnly: true});
    player.steel -= moonTiles.length;
    player.heat += (4 * moonTiles.length);
    return undefined;
  }
}
