import {Card} from '../Card';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class WaterSplittingPlant extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.WATER_SPLITTING_PLANT,
      tags: [Tags.BUILDING],
      cost: 12,

      requirements: CardRequirements.builder((b) => b.oceans(2)),
      metadata: {
        cardNumber: '177',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 3 Energy to raise oxygen 1 step.', (eb) => {
            eb.energy(3).startAction.oxygen(1);
          });
        }),
        description: 'Requires 2 ocean tiles.',
      },
    });
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.energy >= 3 && player.canAfford(0, {tr: {oxygen: 1}});
  }
  public action(player: Player) {
    player.energy -= 3;
    return player.game.increaseOxygenLevel(player, 1);
  }
}
