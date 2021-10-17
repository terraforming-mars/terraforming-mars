import {IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class VenusMagnetizer extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.VENUS_MAGNETIZER,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS],
      cost: 7,

      requirements: CardRequirements.builder((b) => b.venus(10)),
      metadata: {
        cardNumber: '256',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your Energy production 1 step to raise Venus 1 step.', (eb) => {
            eb.production((pb) => pb.energy(1)).startAction.venus(1);
          });
        }),
        description: 'Requires Venus 10%.',
      },
    });
  };

  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) > 0 && player.canAfford(0, {tr: {venus: 1}});
  }
  public action(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}
