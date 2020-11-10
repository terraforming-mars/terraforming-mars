
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../ISpace';
import {CardName} from '../../CardName';

export class Gyropolis implements IProjectCard {
    public cost = 20;
    public tags = [Tags.CITY, Tags.STEEL];
    public name = CardName.GYROPOLIS;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
      if (game.board.getAvailableSpacesForCity(player).length === 0) return false;
      return player.getProduction(Resources.ENERGY) >= 2;
    }
    public play(player: Player, game: Game) {
      const tags: Array<Tags> = [Tags.VENUS, Tags.EARTH];
      player.addProduction(Resources.ENERGY, -2);
      player.addProduction(Resources.MEGACREDITS, player.getMultipleTagCount(tags));
      return new SelectSpace('Select space for city tile', game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
        game.addCityTile(player, space.id);
        return undefined;
      });
    }
}
