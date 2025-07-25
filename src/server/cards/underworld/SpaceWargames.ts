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
        addResources: 4,
      },

      action: {
        or: {
          behaviors: [
            {
              spend: {titanium: 1},
              addResources: 2,
              title: 'Spend 1 titanium to add 2 fighter resources to this card.',
            },
            {
              spend: {resourcesHere: 6},
              underworld: {markThisGeneration: {}},
              title: 'Spend 6 fighter resources on this card to take first player next generation.',
            },
          ],
          autoSelect: true,
        },
      },

      metadata: {
        cardNumber: 'U048',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to put 2 fighters on this card.',
            (ab) => ab.titanium(1).startAction.resource(CardResource.FIGHTER, 2)).br;
          b.action('Spend 6 fighter resource on this card to take first player next generation.',
            (ab) => ab.or().resource(CardResource.FIGHTER, {amount: 6, digit}).startAction.firstPlayer()).br;
          b.vpText(' 1 VP for each Jovian tag you have.').br;
          b.resource(CardResource.FIGHTER, {amount: 4, digit});
        }),
        description: 'Put 4 fighters on this card.',
      },
    });
  }
}

