import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {ActiveCorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class UtopiaInvest extends ActiveCorporationCard implements ICorporationCard, IActionCard {
  constructor() {
    super({
      name: CardName.UTOPIA_INVEST,
      tags: [Tag.BUILDING],
      startingMegaCredits: 40,

      behavior: {
        production: {steel: 1, titanium: 1},
      },

      action: {
        or: {
          title: 'Select production to decrease one step and gain 4 resources',
          behaviors: [
            {title: 'Decrease M€ production', production: {megacredits: -1}, stock: {megacredits: 4}},
            {title: 'Decrease steel production', production: {steel: -1}, stock: {steel: 4}},
            {title: 'Decrease titanium production', production: {titanium: -1}, stock: {titanium: 4}},
            {title: 'Decrease plants production', production: {plants: -1}, stock: {plants: 4}},
            {title: 'Decrease energy production', production: {energy: -1}, stock: {energy: 4}},
            {title: 'Decrease heat production', production: {heat: -1}, stock: {heat: 4}},
          ],
        },
      },

      metadata: {
        cardNumber: 'R33',
        description: 'You start with 40 M€. Increase your steel and titanium production 1 step each.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(40).nbsp.production((pb) => pb.steel(1).titanium(1));
          b.corpBox('action', (ce) => {
            ce.action('Decrease any production to gain 4 resources of that kind.', (eb) => {
              eb.production((eb) => eb.wild(1)).startAction.wild(4, {digit});
            });
          });
        }),
      },
    });
  }
}
