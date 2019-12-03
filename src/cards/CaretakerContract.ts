
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {CardType} from './CardType';
import {Tags} from './Tags';
import {Player} from '../Player';
import {Game} from '../Game';

export class CaretakerContract implements IActionCard, IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = 'Caretaker Contract';
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= 0 - (
        2 * player.getRequirementsBonus(game)
      );
    }
    public play() {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.heat >= 8;
    }
    public action(player: Player) {
      player.heat -= 8;
      player.terraformRating++;
      return undefined;
    }
}
