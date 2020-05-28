
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { CardName } from '../CardName';
import { Resources } from '../Resources';

export class DeimosDown implements IProjectCard {
    public cost: number = 31;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.DEIMOS_DOWN;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 3);
      game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 8);
      player.steel += 4;
      return undefined;
    }
}
