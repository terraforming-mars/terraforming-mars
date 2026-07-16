import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class EarthquakeMachine extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.EARTHQUAKE_MACHINE,
      tags: [Tag.SCIENCE],
      cost: 10,
      requirements: {tag: Tag.SCIENCE, count: 2},

      behavior: {
        decreaseAnyProduction: {type: Resource.PLANTS, count: 1},
      },

      action: {
        spend: {energy: 1},
        underworld: {excavate: 1},
      },

      metadata: {
        cardNumber: 'U055',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 energy to excavate an underground resource.',
            (ab) => ab.energy(1).startAction.excavate(1));
          b.br;
          b.production((pb) => pb.minus().plants(1, {all})).br;
          b.plainText('Requires 2 science tags. Decrease any plant production 1 step');
        }),
      },
    });
  }
}
