import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IProjectCard} from '../IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class ValleyTrust extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.VALLEY_TRUST,
      tags: [Tags.EARTH],
      startingMegaCredits: 37,
      initialActionText: 'Draw 3 Prelude cards, and play one of them',

      cardDiscount: {tag: Tags.SCIENCE, amount: 2},
      metadata: {
        cardNumber: 'R34',
        description: 'You start with 37 M€. As your first action, draw 3 Prelude cards, and play one of them. Discard the other two.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(37).nbsp.prelude().asterix();
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a Science tag, you pay 2M€ less for it.', (eb) => {
              eb.science(1, {played}).startEffect.megacredits(-2);
            });
          });
        }),
      },
    });
  }


  public override getCardDiscount(player: Player, card: IProjectCard) {
    // TODO(chosta) -> improve once the discounts property is given a go
    return player.cardTagCount(card, Tags.SCIENCE) * 2;
  }

  public initialAction(player: Player) {
    const cardsDrawn: Array<IProjectCard> = [
      player.game.dealer.dealPreludeCard(),
      player.game.dealer.dealPreludeCard(),
      player.game.dealer.dealPreludeCard(),
    ];

    return new SelectCard('Choose prelude card to play', 'Play', cardsDrawn, (foundCards: Array<IProjectCard>) => {
      if (foundCards[0].canPlay === undefined || foundCards[0].canPlay(player)) {
        return player.playCard(foundCards[0]);
      } else {
        throw new Error('You cannot pay for this card');
      }
    });
  }

  public play() {
    return undefined;
  }
}
