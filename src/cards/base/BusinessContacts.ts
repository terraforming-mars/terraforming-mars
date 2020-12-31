
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class BusinessContacts extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.BUSINESS_CONTACTS,
      tags: [Tags.EARTH],
      cost: 7,

      metadata: {
        cardNumber: '111',
        renderData: CardRenderer.builder((b) => b.text('Look at the top 4 cards from the deck. take 2 of them into hand and discard the other 2', CardRenderItemSize.SMALL, true)),
      },
    });
  }
  public play(player: Player, game: Game) {
    const cards: Array<IProjectCard> = [
      game.dealer.dealCard(),
      game.dealer.dealCard(),
      game.dealer.dealCard(),
      game.dealer.dealCard(),
    ];
    return new SelectCard(
      'Select cards to keep of top 4 cards from deck',
      'Keep',
      cards,
      (found: Array<IProjectCard>) => {
        player.cardsInHand.push(found[0], found[1]);
        cards.forEach((card) => {
          if (found.find((f) => f.name === card.name) === undefined) {
            game.dealer.discard(card);
          }
        });
        return undefined;
      }, 2, 2,
    );
  }
}
