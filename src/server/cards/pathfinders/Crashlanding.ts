import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {TileType} from '../../../common/TileType';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Board} from '../../boards/Board';
import {Size} from '../../../common/cards/render/Size';
import {OrOptions} from '../../inputs/OrOptions';
import {CardResource} from '../../../common/CardResource';
import {SelectOption} from '../../inputs/SelectOption';
import {Tile} from '../../Tile';
import {CrashlandingBonus} from '../../pathfinders/CrashlandingBonus';

export class Crashlanding extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.CRASHLANDING,
      cost: 20,

      behavior: {
        addResourcesToAnyCard: [
          {type: CardResource.DATA, count: 1, autoSelect: true},
          {type: undefined, count: 1, autoSelect: true},
        ],
      },

      metadata: {
        cardNumber: 'Pf48',
        renderData: CardRenderer.builder((b) => {
          b.tile(TileType.CRASHLANDING, false, true).asterix().data().asterix().wild(1).asterix().br;
          b.text('(Place AND ORIENT this tile on a non-reserved space adjacent to no more than 1 city.', Size.TINY, false, false).br;
          b.text('Crashsite grants an ADJACENCY BONUS of 1 data, and either 1 steel or 1 titanium.', Size.TINY, false, false).br;
          b.text('When placing Crashsite, for each tile you own next it, gain those bonuses.', Size.TINY, false, false).br;
          b.text('Add 1 data to any card. Add 1 resource to any card.)', Size.TINY, false, false).br;
        }),
      },
    });
  }

  private playableSpaces(player: Player): Array<ISpace> {
    const board = player.game.board;
    const spaces = board.getAvailableSpacesOnLand(player);
    return spaces.filter((space) => board.getAdjacentSpaces(space).filter(Board.isCitySpace).length <= 1);
  }

  public override canPlay(player: Player): boolean {
    return this.playableSpaces(player).length > 0;
  }
  public override bespokePlay(player: Player) {
    return new SelectSpace(
      'Select space for Crashlanding tile',
      this.playableSpaces(player),
      (space: ISpace) => {
        space.adjacency = {bonus: ['callback']};
        const tile: Tile = {
          tileType: TileType.CRASHLANDING,
          card: this.name,
        };
        player.game.addTile(player, space, tile);
        const orOptions = new OrOptions(
          new SelectOption('Leave as it is', '', () => {
            tile.rotated = undefined;
            this.grantPlacementBonuses(player, space);
            return undefined;
          }),
          new SelectOption('Rotate Crashlanding', '', () => {
            tile.rotated = true;
            this.grantPlacementBonuses(player, space);
            return undefined;
          }),
        );
        orOptions.title = 'Orient Crashlanding';
        return orOptions;
      });
  }

  private grantPlacementBonuses(player: Player, space: ISpace) {
    const game = player.game;
    for (const adjacentSpace of game.board.getAdjacentSpaces(space)) {
      if (adjacentSpace.player === player && adjacentSpace.tile !== undefined) {
        const bonuses = CrashlandingBonus.onTilePlacedAdjacentToCrashlanding(game, space, adjacentSpace);
        for (const bonus of bonuses) {
          game.grantSpaceBonus(player, bonus);
        }
      }
    }
  }
}
