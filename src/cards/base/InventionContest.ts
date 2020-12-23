import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class InventionContest implements IProjectCard {
    public cardType = CardType.EVENT;
    public cost = 2;
    public tags = [Tags.SCIENCE];
    public name = CardName.INVENTION_CONTEST;

    public play(player: Player, game: Game) {
      const cardsDrawn: Array<IProjectCard> = [
        game.dealer.dealCard(),
        game.dealer.dealCard(),
        game.dealer.dealCard(),
      ];
      return new SelectCard('Select card to take into hand', 'Take', cardsDrawn, (foundCards: Array<IProjectCard>) => {
        player.cardsInHand.push(foundCards[0]);
        cardsDrawn
          .filter((c) => c !== foundCards[0])
          .forEach((c) => game.dealer.discard(c));
        return undefined;
      });
    }
    public metadata: CardMetadata = {
      cardNumber: '192',
      renderData: CardRenderer.builder((b) => {
        b.text('Look at the top 3 cards from the deck. Take 1 of them into hand and discard the other two', CardRenderItemSize.SMALL, true);
      }),
    }
}
