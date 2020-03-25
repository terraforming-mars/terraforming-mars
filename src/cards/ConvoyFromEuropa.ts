
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { CardName } from '../CardName';

export class ConvoyFromEuropa implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.CONVOY_FROM_EUROPA;

    public play(player: Player, game: Game) {
      player.cardsInHand.push(game.dealer.dealCard());
      game.addOceanInterrupt(player);
      return undefined;
    }
}
