import {IProjectCard} from '../IProjectCard';
import {VictoryPoints} from '../ICard';
import {IActionCard} from '../ICard';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';

export class FloaterUrbanism extends ActionCard implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.FLOATER_URBANISM,
      cost: 7,
      tags: [Tag.VENUS],
      resourceType: CardResource.VENUSIAN_HABITAT,
      requirements: CardRequirements.builder((b) => b.tag(Tag.VENUS, 4)),
      victoryPoints: VictoryPoints.resource(1, 1),

      action: {
        removeResourcesFromAnyCard: {type: CardResource.FLOATER, count: 1},
        addResources: 1,
        // 'Choose a card to move a floater to a Venusian habitat.',
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 floater from any card and add 1 Venusian habitat on this card.', (ab) => {
            ab.floaters(1).startAction.venusianHabitat(1);
          }).br;
          b.vpText('1 VP for every Venusian habitat on this card.');
        }),
        description: 'Requires 4 Venus tags.',
      },
    });
  }
}
