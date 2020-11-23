import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../ISpace';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SpaceBonus} from '../../SpaceBonus';
import {TileType} from '../../TileType';
import {CardType} from '../CardType';
import {IResourceCard} from '../ICard';
import {Tags} from '../Tags';

export class OceanSanctuary implements IResourceCard {
  public cost = 9;
  public resourceType = ResourceType.ANIMAL;
  public resourceCount: number = 0;
  public tags = [Tags.ANIMAL];
  public cardType = CardType.ACTIVE;
  public name = CardName.OCEAN_SANCTUARY;

  public canPlay(player: Player, game: Game): boolean {
    return game.board.getOceansOnBoard() >= 5 - player.getRequirementsBonus(game);
  }

  public getVictoryPoints(): number {
    return Math.floor(this.resourceCount);
  }

  public play(player: Player, game: Game) {
    this.resourceCount++;
    return new SelectSpace(
      'Select space for Ocean Sanctuary',
      game.board.getOceansTiles(false),
      (space: ISpace) => {
        game.removeTile(space.id);
        game.addTile(player, space.spaceType, space, {
          tileType: TileType.OCEAN_SANCTUARY,
        });
        space.adjacency = {bonus: [SpaceBonus.ANIMAL]};
        return undefined;
      });
  }
}
