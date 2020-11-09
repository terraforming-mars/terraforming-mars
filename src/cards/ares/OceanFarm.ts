import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../ISpace';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {SpaceBonus} from '../../SpaceBonus';
import {TileType} from '../../TileType';
import {CardType} from './../CardType';
import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';

export class OceanFarm implements IProjectCard {
  public cost = 15;
  public tags = [Tags.PLANT, Tags.STEEL];
  public cardType = CardType.AUTOMATED;
  public name = CardName.OCEAN_FARM;

  public canPlay(player: Player, game: Game): boolean {
    return game.board.getOceansOnBoard() >= 4 - player.getRequirementsBonus(game);
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.HEAT, 1);
    player.addProduction(Resources.PLANTS, 1);

    return new SelectSpace(
        'Select space for Ocean Farm',
        game.board.getOceansTiles(false),
        (space: ISpace) => {
          game.removeTile(space.id);
          game.addTile(player, space.spaceType, space, {
            tileType: TileType.OCEAN_FARM,
            card: this.name,
          });
          space.adjacency = {bonus: [SpaceBonus.PLANT]};
          return undefined;
        },
    );
  }
}
