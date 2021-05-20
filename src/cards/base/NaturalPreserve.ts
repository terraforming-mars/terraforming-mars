import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {TileType} from '../../TileType';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class NaturalPreserve extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.NATURAL_PRESERVE,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata: CardMetadata = {
      cardNumber: '044',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(1)).nbsp.tile(TileType.NATURAL_PRESERVE, true).asterix();
      }),
      description: 'Oxygen must be 4% or less. Place this tile NEXT TO NO OTHER TILE. Increase your M€ production 1 step.',
      victoryPoints: 1,
    }) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tags.SCIENCE, Tags.BUILDING],
      cost: 9,
      productionBox: Units.of({megacredits: 1}),
      adjacencyBonus,
      requirements: CardRequirements.builder((b) => b.oxygen(4).max()),
      metadata,
    });
  }
  private getAvailableSpaces(player: Player): Array<ISpace> {
    return player.game.board.getAvailableSpacesOnLand(player)
      .filter((space) => player.game.board.getAdjacentSpaces(space).some((adjacentSpace) => adjacentSpace.tile !== undefined) === false);
  }
  public canPlay(player: Player): boolean {
    return super.canPlay(player) && this.getAvailableSpaces(player).length > 0;
  }
  public play(player: Player) {
    return new SelectSpace('Select space for special tile next to no other tile', this.getAvailableSpaces(player), (foundSpace: ISpace) => {
      player.game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.NATURAL_PRESERVE});
      foundSpace.adjacency = this.adjacencyBonus;
      player.addProduction(Resources.MEGACREDITS, 1);
      return undefined;
    });
  }
  public getVictoryPoints() {
    return 1;
  }
}
