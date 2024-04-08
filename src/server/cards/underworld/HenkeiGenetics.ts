import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActiveCorporationCard} from '../corporation/CorporationCard';
import {played} from '../Options';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';

export class HenkeiGenetics extends ActiveCorporationCard {
  constructor() {
    super({
      name: CardName.HENKEI_GENETICS,
      tags: [Tag.MICROBE],
      startingMegaCredits: 47,

      behavior: {
        underworld: {corruption: 1},
      },

      action: {
        spend: {corruption: 1},
        drawCard: {count: 1, tag: Tag.MICROBE},
      },

      metadata: {
        cardNumber: 'UC04',
        description: 'You start with 47 M€ and 1 corruption.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(47).corruption(1).br;
          b.effect('After you play a microbe card that can hold microbes, add 2 microbes to it.', (eb) => {
            eb.microbes(1, {played}).startEffect.microbes(2);
          }).br;
          b.action('Pay 1 corruption to draw a card with a microbe tag.', (ab) => {
            ab.corruption(1).startAction.cards(1, {secondaryTag: Tag.MICROBE});
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (!player.isCorporation(this.name)) {
      return;
    }
    if (card.resourceType === CardResource.MICROBE && card.tags.includes(Tag.MICROBE)) {
      player.addResourceTo(card, {qty: 2, log: true});
    }
  }
}
