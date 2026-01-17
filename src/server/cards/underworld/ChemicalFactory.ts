import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Tag} from '@/common/cards/Tag';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardType} from '@/common/cards/CardType';
import {ActionCard} from '@/server/cards/ActionCard';

export class ChemicalFactory extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.CHEMICAL_FACTORY,
      cost: 18,
      tags: [Tag.CRIME, Tag.BUILDING],

      action: {
        spend: {plants: 1},
        underworld: {excavate: 1},
      },

      behavior: {
        underworld: {corruption: 2},
      },

      metadata: {
        cardNumber: 'U060',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 plant to excavate an underground resource.',
            (ab) => ab.plants(1).startAction.excavate(1));
          b.br;
          b.corruption(2);
        }),
        description: 'Gain 2 corruption.',
      },
    });
  }
}

