import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {TileType} from '../../TileType';
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

export class NaturalPreserve implements IProjectCard {
    public cost = 9;
    public tags = [Tags.SCIENCE, Tags.BUILDING];
    public cardType = CardType.AUTOMATED;
    public name = CardName.NATURAL_PRESERVE;
    public adjacencyBonus?: IAdjacencyBonus = undefined;

    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
      return game.board.getAvailableSpacesOnLand(player)
        .filter((space) => game.board.getAdjacentSpaces(space).filter((adjacentSpace) => adjacentSpace.tile !== undefined).length === 0);
    }
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() <= 4 + player.getRequirementsBonus(game) && this.getAvailableSpaces(player, game).length > 0;
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
    public metadata: CardMetadata = {
      cardNumber: '044',
      requirements: CardRequirements.builder((b) => b.oxygen(4).max()),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(1)).nbsp.tile(TileType.NATURAL_PRESERVE, true).asterix();
      }),
      description: 'Oxygen must be 4% or less. Place this tile NEXT TO NO OTHER TILE. Increase your MC production 1 step.',
      victoryPoints: 1,
    }
}
