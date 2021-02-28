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
      tags: [Tags.MOON, Tags.EVENT],
      cost: 10,

      requirements: CardRequirements.builder((b) => b.party(PartyName.KELVINISTS).miningRate(1)),
      metadata: {
        description: 'Requires that Kelvinists are ruling or that you have 2 delegates there and 1 mine tile on the Moon. ' +
        'Pay 1 steel per mine tile on the Moon to gain 4 heat per mine tile on the Moon. Raise Mining Rate 1 step.',
        cardNumber: 'M57',
        // TODO(kberg): Switch mining rate to mines, also YOU must have a mine.
        renderData: CardRenderer.builder((b) => {
          b.minus().steel(1).slash().tile(TileType.MOON_MINE, false).asterix().br;
          b.text('=>').heat(4).br;
          b.moonMiningRate();
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    const game = player.game;
    if (game.turmoil === undefined || !game.turmoil.canPlay(player, PartyName.KELVINISTS)) {
      return false;
    }
    const moonTiles = MoonExpansion.tiles(game, TileType.MOON_MINE, true);
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
