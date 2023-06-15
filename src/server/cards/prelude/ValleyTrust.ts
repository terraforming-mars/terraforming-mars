import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IProjectCard} from '../IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {IPreludeCard} from './IPreludeCard';

export class ValleyTrust extends Card implements ICorporationCard {
  constructor() {
    super({
      type: CardType.CORPORATION,
      name: CardName.VALLEY_TRUST,
      tags: [Tag.EARTH],
      startingMegaCredits: 37,
      initialActionText: 'Draw 3 Prelude cards, and play one of them',

      cardDiscount: {tag: Tag.SCIENCE, amount: 2},
      metadata: {
        cardNumber: 'R34',
        description: 'You start with 37 M€. As your first action, draw 3 Prelude cards, and play one of them. Discard the other two.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(37).nbsp.prelude().asterix();
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a science tag, you pay 2M€ less for it.', (eb) => {
              eb.science(1, {played}).startEffect.megacredits(-2);
            });
          });
        }),
      },
    });
  }

  public override getCardDiscount(player: IPlayer, card: IProjectCard) {
    // TODO(chosta) -> improve once the discounts property is given a go
    return player.tags.cardTagCount(card, Tag.SCIENCE) * 2;
  }

  public initialAction(player: IPlayer) {
    const game = player.game;
    const cardsDrawn: Array<IPreludeCard> = [
      game.preludeDeck.draw(game),
      game.preludeDeck.draw(game),
      game.preludeDeck.draw(game),
    ];

    return new SelectCard<IPreludeCard>('Choose prelude card to play', 'Play', cardsDrawn, ([card]) => {
      return player.playCard(card);
    });
  }
}
