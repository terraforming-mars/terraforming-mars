import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../common/Resources';
import {TileType} from '../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {Units} from '../../common/Units';

export class LunarMineUrbanization extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_MINE_URBANIZATION,
      cardType: CardType.EVENT,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 8,
      productionBox: Units.of({megacredits: 1}),
      // NOTE(kberg): Rules were that it says it Requires 1 mine tile. Changing to "Requires you have 1 mine tile."
      requirements: CardRequirements.builder((b) => b.miningTiles(1)),
      tr: {moonColony: 1},

      metadata: {
        description: 'Requires you have 1 mine tile. Increase your M€ production 1 step. Replace one of your mine tiles ' +
        'with this special tile. Raise the Colony Rate 1 step. This tile counts both as a colony and a mine tile.',
        cardNumber: 'M55',

        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).br;
          b.moonColonyRate();
          b.tile(TileType.LUNAR_MINE_URBANIZATION, true).asterix();
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1);
    const tiles = MoonExpansion.spaces(player.game, TileType.MOON_MINE, {ownedBy: player});
    return new SelectSpace('Select one of your mines to upgrade', tiles, (space) => {
      if (space.tile === undefined) {
        throw new Error(`Space ${space.id} should have a tile, how doesn't it?`);
      }
      space.tile.tileType = TileType.LUNAR_MINE_URBANIZATION;
      MoonExpansion.raiseColonyRate(player);
      return undefined;
    });
  }
}
