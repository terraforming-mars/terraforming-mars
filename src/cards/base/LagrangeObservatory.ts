import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

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
    public metadata: CardMetadata = {
      cardNumber: '196',
      renderData: CardRenderer.builder((b) => b.cards(1)),
      description: 'Draw 1 card.',
      victoryPoints: 1,
    }
}
