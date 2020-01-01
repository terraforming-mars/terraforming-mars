
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from '../Resources';

export class Bushes implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.PLANT];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = 'Bushes';
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -10 - (
        2 * player.getRequirementsBonus(game)
      );
    }
    public play(player: Player) {
      player.setProduction(Resources.PLANTS,2);
      player.plants += 2;
      return undefined;
    }
}
