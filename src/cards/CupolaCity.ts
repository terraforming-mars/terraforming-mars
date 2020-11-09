
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class CupolaCity implements IProjectCard {
    public cost = 16;
    public tags = [Tags.CITY, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.CUPOLA_CITY;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() <= 9 + player.getRequirementsBonus(game) &&
        player.getProduction(Resources.ENERGY) >= 1 &&
        game.board.getAvailableSpacesForCity(player).length > 0;
    }
    public play(player: Player, game: Game) {
      return new SelectSpace(
          'Select a space for city tile',
          game.board.getAvailableSpacesForCity(player),
          (space: ISpace) => {
            game.addCityTile(player, space.id);
            player.addProduction(Resources.ENERGY, -1);
            player.addProduction(Resources.MEGACREDITS, 3);
            return undefined;
          },
      );
    }
}
