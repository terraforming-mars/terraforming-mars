import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../requirements/CardRequirements';


export class NeonJellyfish extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.NEON_JELLYFISH,
      tags: [Tag.ANIMAL],
      cost: 7,
      resourceType: CardResource.ANIMAL,
      requirements: CardRequirements.builder((b) => b.oceans(5)),
      victoryPoints: {resourcesHere: {}, per: 2},
      
        behavior: {
        addResources: {oceans: {}, per: 2},
      },

      action: {
        addResources: 1,
      },

      metadata: {
        cardNumber: 'N77',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
            b.animals(1).slash().oceans(2);
        }),
          description: 'Requires 5 Ocean tiles. Add an animal to this card for every 2 ocean tiles in play. 1 VP per 2 animals on this card.',
      },
    });
    }
  }
