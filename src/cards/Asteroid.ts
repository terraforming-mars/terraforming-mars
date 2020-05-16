import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class Asteroid implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.ASTEROID;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 1);
      game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 3);
      player.titanium += 2;
      return undefined;
    }
}
