import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';

export class EnrichmentFacility extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ENRICHMENT_FACILITY,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 9,
      resourceType: CardResource.RADIATION,

      action: {
        or: {
          autoSelect: true,
          behaviors: [{
            title: 'Spend 1 steel to add 1 radiation to ANY card.',
            spend: {steel: 1},
            addResourcesToAnyCard: {count: 1, type: CardResource.RADIATION}
          },
          {
            title: 'Spend 1 titanium to add 1 radiation to ANY card.',
            spend: {titanium: 1},
            addResourcesToAnyCard: {count: 1, type: CardResource.RADIATION}
          }],
        },
      },

      victoryPoints: {resourcesHere: {}, per:3},

      metadata: {
        cardNumber: 'N16',
        description: {
          text: 'Score 1VP per 3 radiaiton on this card',
          align: 'center',
        },
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 steel or 1 titanium to add 1 radiation to ANY card.', (eb) => {
            eb.steel(1).slash().titanium(1).startAction.radiations(1).asterix();
          }).br;
        }),
      },
    });
  }

  // KEEP THIS
  // private log(player: Player, resource: Resources) {
  //   player.game.log('${0} spent 1 ${1} to gain 7 M€', (b) => b.player(player).string(resource));
  // }
}
