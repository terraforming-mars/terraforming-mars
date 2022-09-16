import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {TileType} from '../../../common/TileType';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {CardName} from '../../../common/cards/CardName';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {nextToNoOtherTileFn} from '../../boards/Board';
import {max} from '../Options';

export class NaturalPreserve extends Card implements IProjectCard {
  constructor(
    name = CardName.NATURAL_PRESERVE,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '044',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(1)).nbsp.tile(TileType.NATURAL_PRESERVE, true).asterix();
      }),
      description: 'Oxygen must be 4% or less. Place this tile NEXT TO NO OTHER TILE. Increase your M€ production 1 step.',
    }) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 9,

      behavior: {
        production: {megacredits: 1},
      },

      adjacencyBonus,
      requirements: CardRequirements.builder((b) => b.oxygen(4, {max})),
      victoryPoints: 1,
      metadata,
    });
  }
  private getAvailableSpaces(player: Player): Array<ISpace> {
    return player.game.board.getAvailableSpacesOnLand(player)
      .filter(nextToNoOtherTileFn(player.game.board));
  }
  public override bespokeCanPlay(player: Player): boolean {
    return this.getAvailableSpaces(player).length > 0;
  }
  public override bespokePlay(player: Player) {
    return new SelectSpace('Select space for special tile next to no other tile', this.getAvailableSpaces(player), (space: ISpace) => {
      player.game.addTile(player, space.spaceType, space, {tileType: TileType.NATURAL_PRESERVE});
      space.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }
}
