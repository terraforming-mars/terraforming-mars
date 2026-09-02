import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {ActionCard} from '../ActionCard';
import {CardResource} from '../../../common/CardResource';

export class PersonalSpacecruiser extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PERSONAL_SPACECRUISER,
      cost: 12,
      tags: [Tag.CRIME, Tag.SPACE],

      action: {
        spend: {energy: 1},
        stock: {megacredits: {underworld: {corruption: {}}, each: 2}},
      },

      behavior: {
        underworld: {corruption: 1},
        addResourcesToAnyCard: {count: 1, type: CardResource.FIGHTER},
      },

      metadata: {
        cardNumber: 'U051',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 energy to gain 2 M€ for each corruption resource you have.',
            (ab) => ab.energy(1).startAction.megacredits(2).slash().corruption()).br;
          b.corruption(1).resource(CardResource.FIGHTER).asterix().br;
        }),
        description: 'Gain 1 corruption. Put 1 fighter on ANY card.',
      },
    });
  }
}

