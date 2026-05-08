import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class VenusianFluctuatingPlants extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.VENUSIAN_FLUCTUATING_PLANTS,
      tags: [Tag.VENUS, Tag.PLANT],
      cost: 19,
      victoryPoints: 2,
      requirements: {venus: 6},
      metadata: {
        cardNumber: 'B43',
        description: 'Requires at least 6% Venus.',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Floater to any card, OR spend 3 Plants to add 2 Floaters to any card.', (ab) => {
            ab.empty().startAction.resource(CardResource.FLOATER).asterix().br;
            ab.or().br;
            ab.plants(-3).startAction.resource(CardResource.FLOATER, 2).asterix();
          });
        }),
      },
    });
  }

  public canAct(_player: IPlayer): boolean {
    return true;
  }

  public action(player: IPlayer) {
    const options: Array<SelectOption> = [
      new SelectOption('Add 1 Floater to any card', 'Add 1 Floater').andThen(() => {
        player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 1}));
        return undefined;
      }),
    ];
    if (player.plants >= 3) {
      options.push(new SelectOption('Spend 3 Plants to add 2 Floaters to any card', 'Add 2 Floaters').andThen(() => {
        player.stock.deduct(Resource.PLANTS, 3);
        player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 2}));
        return undefined;
      }));
    }
    if (options.length === 1) return options[0].andThen(() => undefined);
    return new OrOptions(...options);
  }
}
