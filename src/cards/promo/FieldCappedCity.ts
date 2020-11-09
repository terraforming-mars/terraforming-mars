import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class FieldCappedCity implements IProjectCard {
    public cost = 29;
    public tags = [Tags.CITY, Tags.STEEL, Tags.ENERGY];
    public name = CardName.FIELD_CAPPED_CITY;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      return game.board.getAvailableSpacesForCity(player).length > 0;
    }

    public play(player: Player, game: Game) {
      return new SelectSpace(
          'Select space for city tile',
          game.board.getAvailableSpacesForCity(player),
          (space: ISpace) => {
            game.addCityTile(player, space.id);
            player.plants += 3;
            player.addProduction(Resources.ENERGY, 1);
            player.addProduction(Resources.MEGACREDITS, 2);
            return undefined;
          },
      );
    }
}
