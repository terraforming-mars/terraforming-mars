import {Tag} from '@/common/cards/Tag';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {IActionCard} from '@/server/cards/ICard';
import {IPlayer} from '@/server/IPlayer';
import {PreludeCard} from '@/server/cards/prelude/PreludeCard';
import {Phase} from '@/common/Phase';
import {Priority} from '@/server/deferredActions/Priority';
import {SimpleDeferredAction} from '@/server/deferredActions/DeferredAction';

export class WorldGovernmentAdvisor extends PreludeCard implements IActionCard {
  constructor() {
    super({
      name: CardName.WORLD_GOVERNMENT_ADVISOR,
      tags: [Tag.EARTH],

      behavior: {
        tr: 2,
        drawCard: 1,
      },

      metadata: {
        cardNumber: 'P67',
        renderData: CardRenderer.builder((b) => {
          b.action('RAISE 1 GLOBAL PARAMETER WITHOUT GETTING ANY TR OR OTHER BONUSES.', (ab) => {
            ab.empty().startAction.oceans(1).oxygen(1).temperature(1).venus(1).asterix();
          }).br;
          b.tr(2).cards(1);
        }),
        description: 'Raise your TR 2 steps. Draw 1 card.',
      },
    });
  }

  public canAct(player: IPlayer) {
    const orOptions = player.game.worldGovernmentTerraformingInput(player);
    if (orOptions.options.length === 0) {
      this.warnings.add('marsIsTerraformed');
    }
    return true;
  }

  public action(player: IPlayer) {
    const game = player.game;

    // This temporarily changes the game phase to Solar so the current player does not
    // benefit from the global parameter change.
    const phase = game.phase;
    game.phase = Phase.SOLAR;
    game.defer(new SimpleDeferredAction(player, () => {
      game.phase = phase;
      return undefined;
    }), Priority.BACK_OF_THE_LINE);

    const orOptions = game.worldGovernmentTerraformingInput(player);
    return (orOptions.options.length === 0) ? undefined : orOptions;
  }
}
