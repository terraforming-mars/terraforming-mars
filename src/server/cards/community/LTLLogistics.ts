import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {IActionCard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class LTLLogistics extends Card implements IActionCard, ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.LTL_LOGISTICS,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 35,

      firstAction: {
        text: 'Draw a card with a science tag',
        drawCard: {count: 1, tag: Tag.SCIENCE},
      },

      metadata: {
        cardNumber: '',
        description: 'You start with 35 M€.  As your first action, reveal cards until you have revealed a science tag. Take it and discard the rest.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(35).nbsp.cards(1, {secondaryTag: Tag.SCIENCE});
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action('If you have fewer than 5 cards in your hand, draw a card', (eb) => {
              eb.empty().startAction.cards(1);
            });
          });
        }),
      },
    });
  }

  public canAct(player: Player): boolean {
    return player.cardsInHand.length < 5;
  }

  public action(player: Player) {
    player.drawCard(1);
    return undefined
  }
}
