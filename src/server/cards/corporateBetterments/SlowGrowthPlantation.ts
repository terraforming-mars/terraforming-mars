// ============================================================
// Slow-Growth Plantation - B04
// Active: Req 4% oxygen. Start with 3 Microbes.
// Action: add 1 Microbe OR remove 5 Microbes to place a Greenery.
// ============================================================
import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {PlaceGreeneryTile} from '../../deferredActions/PlaceGreeneryTile';

export class SlowGrowthPlantation extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SLOW_GROWTH_PLANTATION,
      tags: [Tag.PLANT, Tag.MICROBE],
      cost: 12,
      resourceType: CardResource.MICROBE,
      requirements: {oxygen: 4},

      behavior: {
        addResources: 3,
      },

      metadata: {
        cardNumber: 'B04',
        description: 'Requires at least 4% Oxygen. Add 3 Microbes to this card.',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (ab) => {
            ab.empty().startAction.resource(CardResource.MICROBE);
          }).br;
          b.or().br;
          b.action('Remove 5 Microbes from this card to place a Greenery tile.', (ab) => {
            ab.resource(CardResource.MICROBE, -5).startAction.greenery();
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return true; // Can always add a microbe; greenery option gated in action
  }

  public action(player: IPlayer) {
    const options: Array<SelectOption> = [
      new SelectOption('Add 1 Microbe to this card', 'Add Microbe').andThen(() => {
        player.addResourceTo(this, {qty: 1, log: true});
        return undefined;
      }),
    ];

    if (this.resourceCount >= 5) {
      options.push(new SelectOption('Remove 5 Microbes to place a Greenery tile', 'Place Greenery').andThen(() => {
        player.removeResourceFrom(this, 5, {log: true});
        player.game.defer(new PlaceGreeneryTile(player));
        return undefined;
      }));
    }

    if (options.length === 1) return options[0].andThen(() => undefined);
    return new OrOptions(...options);
  }
}
