import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';

export class Solarnet implements IProjectCard {
    public cost = 7;
    public tags = [];
    public name = CardName.SOLARNET;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
      return player.checkMultipleTagPresence([Tags.VENUS, Tags.EARTH, Tags.JOVIAN]);
    }
    public play(player: Player, game: Game) {
      player.cardsInHand.push(game.dealer.dealCard());
      player.cardsInHand.push(game.dealer.dealCard());
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
