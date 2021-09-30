import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {Tags} from '../Tags';
import {TileType} from '../../TileType';

export class RareEarthElements extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RARE_EARTH_ELEMENTS,
      cost: 5,
      tags: [Tags.EARTH, Tags.MARS],

      metadata: {
        cardNumber: 'Pf06',
        renderData: CardRenderer.builder((b) => {
          // TODO(kberg): add new tile image.
          b.production(((pb) => pb.megacredits(1))).slash().emptyTile().text('special');
        }),
        description: 'Increase your M€ production by 1 for every special tile you own on Mars.',
      },
    });
  }


  private static INVALID_TILES: Set<TileType> = new Set([TileType.GREENERY, TileType.OCEAN, TileType.CITY]);

  public play(player: Player) {
    const spaces = player.game.board.spaces.filter((space) => {
      return space.player?.id === player.id &&
        space?.tile !== undefined &&
        RareEarthElements.INVALID_TILES.has(space.tile.tileType) === false;
    });

    player.addProduction(Resources.MEGACREDITS, spaces.length, {log: true});
    return undefined;
  }
}

