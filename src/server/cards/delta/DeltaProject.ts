import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {PreludeCard} from '../prelude/PreludeCard';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {DeltaProjectExpansion} from '../../delta/DeltaProjectExpansion';
import {DeltaProjectInput} from '../../delta/DeltaProjectInput';

export class DeltaProject extends PreludeCard implements IActionCard {
  constructor() {
    super({
      name: CardName.DELTA_PROJECT,

      metadata: {
        cardNumber: 'DP01',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend any amount of energy to move that number of steps on the Delta Project track. Each step requires having all the matching tags in play up to that level; wild tags can replace missing ones. Gain resources next to your position.', (ab) => {
            ab.text('X').energy(1).startAction.text('X').plate('Delta track');
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return DeltaProjectExpansion.maxSteps(player) > 0;
  }

  public action(player: IPlayer): PlayerInput {
    const validSteps = DeltaProjectExpansion.getValidAdvanceSteps(player);

    return new DeltaProjectInput(
      validSteps,
    ).andThen((amount) => {
      DeltaProjectExpansion.advance(player, amount);
      return undefined;
    });
  }
}
