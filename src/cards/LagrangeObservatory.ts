
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardName} from '../CardName';

export class LagrangeObservatory implements IProjectCard {
    public cardType = CardType.AUTOMATED;
    public cost = 9;
    public tags = [Tags.SCIENCE, Tags.SPACE];
    public name = CardName.LAGRANGE_OBSERVATORY;

    public play(player: Player, game: Game) {
      player.cardsInHand.push(game.dealer.dealCard());
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
