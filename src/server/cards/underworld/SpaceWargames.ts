import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardResource} from '../../../common/CardResource';
import {CardType} from '../../../common/cards/CardType';
import {ActionCard} from '../ActionCard';
import {digit} from '../Options';

export class SpaceWargames extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SPACE_WARGAMES,
      cost: 25,
      tags: [Tag.JOVIAN, Tag.SPACE],
      victoryPoints: {tag: Tag.JOVIAN},
      resourceType: CardResource.FIGHTER,

      behavior: {
        addResources: 1,
      },

      action: {
        or: {
          behaviors: [
            {
              spend: {titanium: 1},
              addResources: 1,
              title: 'Spend 1 titanium to add 1 fighter resource to this card.',
            },
            {
              spend: {resourcesHere: 1},
              stock: {megacredits: {start: 1, resourcesHere: {}, each: 3}},
              title: 'Spend 1 fighter resource on this card to gain 3 M€ for each fighter on this card, including the fighter.',
            },
          ],
          autoSelect: true,
        },
      },

      metadata: {
        cardNumber: 'U48',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to gain 1 fighter resource to this card.',
            (ab) => ab.titanium(1).startAction.fighter(1)).br;
          b.action('Spend 1 fighter resource on this card to gain 3 M€ for each fighter resource on this card INCLUDING THE PAID FIGHTER.',
            (ab) => ab.or().fighter(1).startAction.megacredits(3, {digit}).slash().fighter().asterix()).br;
          b.fighter();
        }),
        description: 'Put 1 fighter resource on this card. 1VP for each Jovian tag you have.',
      },
    });
  }
}

