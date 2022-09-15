import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';

export class MuseumofEarlyColonisation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MUSEUM_OF_EARLY_COLONISATION,
      cost: 20,
      tags: [Tag.BUILDING, Tag.MARS],
      requirements: CardRequirements.builder((b) => b.oceans(1).cities(1, {all}).greeneries(1, {all})),

      behavior: {
        production: {energy: -1, steel: 1, titanium: 1, plants: 1},
        tr: 1,
      },

      metadata: {
        cardNumber: 'Pf11',
        renderData: CardRenderer.builder((b) => {
          b.production(((pb) => pb.minus().energy(1).nbsp.steel(1).titanium(1).plants(1)));
          b.br.tr(1);
        }),
        description: 'Requires 1 ocean, 1 city and one greenery on Mars. ' +
         'Decrease your energy production 1 step. Raise your steel, titanium, and plant production 1 step. ' +
         'Gain 1 TR.',
      },
    });
  }
}
