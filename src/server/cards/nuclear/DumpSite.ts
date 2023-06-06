import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../requirements/CardRequirements';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {Player} from '../../Player';

export class DumpSite extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.DUMP_SITE,
      tags: [Tag.RADIATION, Tag.BUILDING],
      cost: 19,
      resourceType: CardResource.RADIATION,
      requirements: CardRequirements.builder((b) => b.tag(Tag.RADIATION, 2)),

      action: {
        or: {
          behaviors: [{
            title: 'Draw a card. Add 1 radiation to this card.',
            addResources: 1,
            drawCard: 1,
          },
          {
            title: 'Spend 2 radiations from here to draw 2 cards.',
            spend: {resourcesHere: 2},
            drawCard: 2,
          }],
        },
      },

      metadata: {
        cardNumber: 'N58',
        renderData: CardRenderer.builder((b) => {
          b.action('Draw a card. Add 1 radiation to this card.', (eb) => {
            eb.empty().startAction.cards(1).radiations(1);
          }).br;
          b.or().br;
          b.action('Spend 2 radiations from here to draw 2 cards.', (eb) => {
            eb.radiations(2).startAction.cards(2);
          }).br;
          b.minus().cards(1);
        }),
        description: 'Requires 2 radiation tags. Discard 1 card.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.game.defer(new DiscardCards(player));
    return undefined;
  }
}
