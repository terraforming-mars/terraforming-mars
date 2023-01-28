import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from './LeaderCard';

import {Resources} from '../../../common/Resources';
import {multiplier} from '../Options';

export class Bjorn extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.BJORN,
      cardType: CardType.LEADER,
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

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const targetPlayers = game.getPlayers().filter((p) => p.id !== player.id && p.megaCredits > player.megaCredits);

    targetPlayers.forEach((target) => {
      const qtyToSteal = Math.min(game.generation, target.megaCredits);
      target.stealResource(Resources.MEGACREDITS, qtyToSteal, player);
    });

    this.isDisabled = true;
    return undefined;
  }
}
