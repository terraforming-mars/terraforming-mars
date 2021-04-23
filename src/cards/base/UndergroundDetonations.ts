import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class UndergroundDetonations extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.UNDERGROUND_DETONATIONS,
      tags: [Tags.BUILDING],
      cost: 6,

      metadata: {
        cardNumber: '202',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 10M€ to increase your heat production 2 steps.', (eb) => {
            eb.megacredits(10).startAction.production((pb)=>pb.heat(2));
          });
        }),
      },
    });
  }
  public canAct(player: Player): boolean {
    return player.canAfford(10);
  }
  public action(player: Player) {
    player.game.defer(new SelectHowToPayDeferred(player, 10, {title: 'Select how to pay for action'}));
    player.addProduction(Resources.HEAT, 2);
    return undefined;
  }
  public play() {
    return undefined;
  }
}
