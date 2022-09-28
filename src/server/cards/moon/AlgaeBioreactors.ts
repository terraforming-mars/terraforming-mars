import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class AlgaeBioreactors extends Card {
  constructor() {
    super({
      name: CardName.ALGAE_BIOREACTORS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.PLANT],
      cost: 9,

      behavior: {
        production: {plants: -1},
        global: {oxygen: 1},
        moon: {habitatRate: 1},
      },

      metadata: {
        description: 'Decrease your plant production 1 step. Raise the Habitat Rate 1 step and oxygen 1%.',
        cardNumber: 'M47',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().plants(1)).moonHabitatRate().oxygen(1);
        }),
      },
    });
  }
}
