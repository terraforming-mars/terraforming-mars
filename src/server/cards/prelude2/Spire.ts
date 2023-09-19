import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';

export class Sagitta extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.SPIRE,
      tags: [Tag.CITY, Tag.EARTH],
      startingMegaCredits: 44,
      type: CardType.CORPORATION,

      firstAction: {
        text: 'Draw 4 cards, then discard 3 cards.',
        drawCard: 4,
        // discardCards: 3,
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) =>
          b.megacredits(44).plus().cards(4, {digit}).minus().cards(3, {digit}).br,
        ),
        // // You start with 44 M€. As your first action,
        // draw 4 cards, then discard 3 cards from your hand.
        // b.effect(
        //   'When you play a card with at least 2 tags. including this. add a science resource here', (eb) => eb.noTags().startEffect.megacredits(4)).br;
        // When you use a standard project, science resources here may be spent as 2 M€ each.
        // }),
        // description: 'You start with 28 M€. Increase energy production 1 step and M€ production 2 steps. Draw a card with no tags.',
        // );
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (player.isCorporation(this.name)) {
      const count = card.tags.length + (card.type === CardType.EVENT ? 1 : 0);
      if (count === 2) {
        player.addResourceTo(this, {qty: 1, log: true});
      }
    }
  }
}
