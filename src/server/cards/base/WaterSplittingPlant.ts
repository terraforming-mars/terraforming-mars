import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';

export class WaterSplittingPlant extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.WATER_SPLITTING_PLANT,
      tags: [Tag.BUILDING],
      cost: 12,

      action: {
        spend: {energy: 3},
        global: {oxygen: 1},
      },

      requirements: {oceans: 2},
      metadata: {
        cardNumber: '177',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 3 energy to raise oxygen 1 step.', (eb) => {
            eb.energy(3).startAction.oxygen(1);
          });
        }),
        description: 'Requires 2 ocean tiles.',
      },
    });
  }

  public override bespokeCanAct(player: IPlayer) {
    // This tests for Reds costs that would ideally be dealt with somewhere
    // between ActionCard and the Executor.
    return player.canAfford({cost: 0, tr: {oxygen: 1}});
  }
}
