import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { CardName } from '../CardName';
import { Resources } from '../Resources';

export class BigAsteroid implements IProjectCard {
    public cost: number = 27;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = CardName.BIG_ASTEROID;

    public play(player: Player, game: Game) {
      game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 4);
      player.titanium += 4;
      return game.increaseTemperature(player, 2);
    }
}
