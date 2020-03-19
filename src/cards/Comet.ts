
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { CardName } from '../CardName';
import { Resources } from '../Resources';

export class Comet implements IProjectCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.COMET;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
      game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 3);
      game.addOceanInterrupt(player);
      return game.increaseTemperature(player, 1);
    }
}
