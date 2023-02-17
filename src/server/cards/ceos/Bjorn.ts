import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {Resources} from '../../../common/Resources';
import {multiplier} from '../Options';

export class Bjorn extends CeoCard {
  constructor() {
    super({
      name: CardName.BJORN,
      metadata: {
        cardNumber: 'L02',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('STEAL').megacredits(0, {multiplier}).asterix();
          b.br;
        }),
        description: 'Once per game, steal X M€ from each player that has more M€ than you, where X is the current generation number.',
      },
    });
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const targetPlayers = game.getPlayers().filter((p) => p.id !== player.id && p.megaCredits > player.megaCredits);

    targetPlayers.forEach((target) => {
      target.stealResource(Resources.MEGACREDITS, game.generation, player);
    });

    this.isDisabled = true;
    return undefined;
  }
}
