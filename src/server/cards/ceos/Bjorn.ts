import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {Resource} from '../../../common/Resource';
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

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;
    const targetPlayers = game.getPlayers().filter((p) => p.id !== player.id && p.megaCredits > player.megaCredits);

    targetPlayers.forEach((target) => {
      target.stock.steal(Resource.MEGACREDITS, game.generation, player);
    });

    return undefined;
  }
}
