import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActiveCorporationCard} from '../corporation/CorporationCard';
import {IActionCard, ICard} from '../ICard';
import {digit} from '../Options';
import {CardResource} from '../../../common/CardResource';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IPlayer} from '../../IPlayer';

export class DemetronLabs extends ActiveCorporationCard implements ICorporationCard, IActionCard {
  constructor() {
    super({
      name: CardName.DEMETRON_LABS,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 45,
      resourceType: CardResource.DATA,

      behavior: {
        addResources: 2,
      },

      action: {
        spend: {
          resourcesHere: 3,
        },
        underworld: {
          identify: {count: 3, claim: 1},
        },
      },

      metadata: {
        cardNumber: 'UC02',
        description: 'You start with 45 M€ and 2 data on this card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(45).resource(CardResource.DATA, 2);
          b.br;
          b.effect('After you play a science tag, including this, put 2 data on this card.',
            (eb) => eb.tag(Tag.SCIENCE).startEffect.resource(CardResource.DATA, 2));
          b.br;
          b.action('Spend 3 data here to identify 3 underground resources. Claim 1 of them.',
            (ab) => ab.resource(CardResource.DATA, {amount: 3, digit}).startAction.identify(3, {digit}).claim(1));
        }),
      },
    });
  }

  public onCardPlayedForCorps(player: IPlayer, card: ICard) {
    const scienceTags = player.tags.cardTagCount(card, Tag.SCIENCE);
    this.onScienceTagAdded(player, scienceTags);
  }
  public onNonCardTagAdded(player: IPlayer, tag: Tag) {
    if (tag === Tag.SCIENCE) {
      this.onScienceTagAdded(player, 1);
    }
  }
  public onScienceTagAdded(player: IPlayer, count: number) {
    player.addResourceTo(this, {qty: 2 * count, log: true});
  }
}
