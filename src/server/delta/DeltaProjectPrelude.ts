import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../cards/render/CardRenderer';
import {IActionCard} from '../cards/ICard';
import {PreludeCard} from '../cards/prelude/PreludeCard';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {DeltaProjectExpansion} from './DeltaProjectExpansion';
import {DeltaProjectInput} from './DeltaProjectInput';
import {createDeltaProjectModel} from '../models/DeltaProjectModel';

export class DeltaProjectPrelude extends PreludeCard implements IActionCard {
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
    if (player.game.deltaProjectData === undefined) return false;
    if (player.energy < 1) return false;
    return DeltaProjectExpansion.maxSteps(player) > 0;
  }

  public action(player: IPlayer): PlayerInput {
    const game = player.game;
    const validSteps = DeltaProjectExpansion.getValidAdvanceSteps(player);

    return new DeltaProjectInput(
      'Delta Project: Pay energy to advance on the track',
      'Advance',
      validSteps,
      createDeltaProjectModel(game) ?? (() => { throw new Error('Delta Project model not available'); })(),
    ).andThen((amount) => {
      DeltaProjectExpansion.advance(player, amount);
      return undefined;
    });
  }
}
