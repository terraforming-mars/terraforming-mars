import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../turmoil/parties/PartyName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {Card} from '../Card';

export class HE3ProductionQuotas extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.HE3_PRODUCTION_QUOTAS,
      cardType: CardType.EVENT,
      tags: [Tags.MOON],
      cost: 10,

      requirements: CardRequirements.builder((b) => b.party(PartyName.KELVINISTS).miningTiles(1).any()),
      metadata: {
        description: 'Requires that Kelvinists are ruling or that you have 2 delegates there, and 1 mine tile on the Moon. ' +
        'Pay 1 steel per mine tile on the Moon to gain 4 heat per mine tile on the Moon. Raise the Mining Rate 1 step.',
        cardNumber: 'M57',
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(1).slash().tile(TileType.MOON_MINE, false).asterix().arrow().text('4').heat(1).br;
          b.moonMiningRate();
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    if (super.canPlay(player) === false) {
      return false;
    }
    const moonTiles = MoonExpansion.tiles(player.game, TileType.MOON_MINE, true);
    if (player.steel < moonTiles.length) {
      return false;
    }
    return true;
  }

  public play(player: Player) {
    const moonTiles = MoonExpansion.tiles(player.game, TileType.MOON_MINE, true);
    player.steel -= moonTiles.length;
    player.heat += (4 * moonTiles.length);
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
