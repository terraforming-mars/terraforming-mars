import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Card} from '../Card';

export class LunarMineUrbanization extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_MINE_URBANIZATION,
      type: CardType.EVENT,
      tags: [Tag.MOON, Tag.BUILDING],
      cost: 8,

      behavior: {
        production: {megacredits: 1},
      },
      // NOTE(kberg): Rules were that it says it Requires 1 mine tile. Changing to "Requires you have 1 mine tile."
      requirements: {miningTiles: 1},
      tr: {moonHabitat: 1},

      metadata: {
        description: 'Requires you have 1 mine tile. Increase your M€ production 1 step. Replace one of your mine tiles ' +
        'with this special tile. Raise the habitat rate 1 step. This tile counts both as a habitat and a mine tile.',
        cardNumber: 'M55',

        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).br;
          b.moonHabitatRate();
          b.tile(TileType.LUNAR_MINE_URBANIZATION, true).asterix();
        }),
      },
      tilesBuilt: [TileType.LUNAR_MINE_URBANIZATION],
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return MoonExpansion.spaces(player.game, TileType.MOON_MINE, {ownedBy: player, upgradedTiles: false}).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    const spaces = MoonExpansion.spaces(player.game, TileType.MOON_MINE, {ownedBy: player, upgradedTiles: false});
    return new SelectSpace('Select one of your mines to upgrade', spaces)
      .andThen((space) => {
        if (space.tile === undefined) {
          throw new Error(`Space ${space.id} should have a tile, how doesn't it?`);
        }
        space.tile.tileType = TileType.LUNAR_MINE_URBANIZATION;
        MoonExpansion.raiseHabitatRate(player);
        return undefined;
      });
  }
}
