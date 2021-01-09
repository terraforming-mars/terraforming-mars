import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {TileType} from '../../TileType';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class NaturalPreserve extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.NATURAL_PRESERVE,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata: CardMetadata = {
      cardNumber: '044',
      requirements: CardRequirements.builder((b) => b.oxygen(4).max()),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(1)).nbsp.tile(TileType.NATURAL_PRESERVE, true).asterix();
      }),
      description: 'Oxygen must be 4% or less. Place this tile NEXT TO NO OTHER TILE. Increase your MC production 1 step.',
      victoryPoints: 1,
    }) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tags.SCIENCE, Tags.BUILDING],
      cost: 9,
      adjacencyBonus,
      metadata,
    });
  }
  private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
    return game.board.getAvailableSpacesOnLand(player)
      .filter((space) => game.board.getAdjacentSpaces(space).some((adjacentSpace) => adjacentSpace.tile !== undefined) === false);
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMaxRequirements(player, GlobalParameter.OXYGEN, 4) && this.getAvailableSpaces(player, game).length > 0;
  }
  public play(player: Player, game: Game) {
    return new SelectSpace('Select space for special tile next to no other tile', this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
      game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.NATURAL_PRESERVE});
      foundSpace.adjacency = this.adjacencyBonus;
      player.addProduction(Resources.MEGACREDITS);
      return undefined;
    });
  }
  public getVictoryPoints() {
    return 1;
  }
}
