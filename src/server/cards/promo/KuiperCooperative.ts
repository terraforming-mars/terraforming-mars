import {ActiveCorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IActionCard} from '../ICard';
import {Size} from '../../../common/cards/render/Size';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class KuiperCooperative extends ActiveCorporationCard implements ICorporationCard, IActionCard {
  constructor() {
    super({
      name: CardName.KUIPER_COOPERATIVE,
      tags: [Tag.SPACE, Tag.SPACE],
      startingMegaCredits: 33,
      resourceType: CardResource.ASTEROID,

      behavior: {
        production: {titanium: 1},
      },

      action: {
        addResources: {tag: Tag.SPACE},
      },

      metadata: {
        cardNumber: 'XC01', // Rename
        description: 'You start with 33 M€. Increase titanium production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(33).production((pb) => pb.titanium(1)).br;
          b.action('Add 1 asteroid here for every space tag you have.', (ab) => {
            ab.empty().startAction.resource(CardResource.ASTEROID).slash().tag(Tag.SPACE);
          }).br;
          b.effect('When you use the AQUIFER or ASTEROID standard projects, you can spend asteroids on card as 1M€ each.', (eb) => {
            eb.plate('Standard Project', {size: Size.SMALL}).asterix().startEffect.resource(CardResource.ASTEROID).equals().megacredits(1);
          });
        }),
      },
    });
  }
}
