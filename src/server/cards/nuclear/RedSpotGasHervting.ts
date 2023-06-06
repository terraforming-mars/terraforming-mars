import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {ActionCard} from '../ActionCard';
import {CardRequirements} from '../requirements/CardRequirements';


export class RedSpotGasHarvesting extends ActionCard {
  constructor() {
    super({
      name: CardName.RED_SPOT_GAS_HARVESTING,
      type: CardType.ACTIVE,
      tags: [Tag.RADIATION, Tag.JOVIAN, Tag.SPACE],
      cost: 22,
      resourceType: CardResource.RADIATION,
      victoryPoints: {resourcesHere:{}, per: 3},
      requirements: CardRequirements.builder((b) => b.tag(Tag.SPACE, 2)),
      action: {
        or: {
          behaviors: [
            {
              spend: {titanium: 1},
              addResourcesToAnyCard: {count: 2, type: CardResource.RADIATION},
              title: 'Spend 1 titanium to add 2 radiation to any card.',
            },
            {
              spend: {resourcesHere: 1},
              stock: {steel: 1, energy: 1},
              title: 'Remove 1 radiation here to gain 1 steel and 1 energy.',
            },
          ],
        },
      },
      behavior:{
        drawCard: 2
      },

      metadata: {
        cardNumber: 'N10',
        //description: 'Requires 2 space tags. Draw 2 cards. Score 1VP per 3 radiation on this card.',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 2 radiations to ANY card.', (be) => {
            be.titanium(1).startAction.radiations(2).asterix();
          }).br;
          b.action('Remove 1 radiation here to gain 1 steel and 1 energy.', (be) => {
            be.or(Size.SMALL).nbsp.nbsp.radiations(1).startAction.steel(1).energy(1);
          }).br;
          
          b.cards(2).description('Requires 2 space tags. Draw 2 cards. Score 1VP per 3 radiation on this card.');
        }),
      },
    });
  }
}
