import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {VictoryPoints} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Penguins extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PENGUINS,
      tags: [Tag.ANIMAL],
      cost: 7,
      resourceType: CardResource.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 1),

      action: {
        addResources: 1,
      },

      requirements: CardRequirements.builder((b) => b.oceans(8)),
      metadata: {
        cardNumber: '212',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.vpText('1 VP for each animal on this card.');
        }),
        description: 'Requires 8 oceans.',
      },
    });
  }
}
