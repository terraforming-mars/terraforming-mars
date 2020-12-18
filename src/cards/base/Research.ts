import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Research implements IProjectCard {
    public cost = 11;
    public tags = [Tags.SCIENCE, Tags.SCIENCE];
    public name = CardName.RESEARCH;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      for (let i = 0; i < 2; i++) {
        player.cardsInHand.push(game.dealer.dealCard());
      }
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '090',
      renderData: CardRenderer.builder((b) => {
        b.cards(2);
      }),
      description: 'Counts as playing 2 science cards. Draw 2 cards.',
      victoryPoints: 1,
    }
}
