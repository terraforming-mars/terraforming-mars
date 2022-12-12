import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { Player } from '../../Player';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';

import {Turmoil} from '../../turmoil/Turmoil';

export class Oscar extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.OSCAR,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L15',
        renderData: CardRenderer.builder((b) => {
          b.plus().influence();
          b.br.br;
          b.opgArrow().chairman();
        }),
        description: 'You have +1 influence. Once per game, replace the Chairman with one of your delegates.',
      },
    });
  }

  public isDisabled = false;

  public override play(player: Player) {
    const turmoil = player.game.turmoil;
    if (turmoil) turmoil.addInfluenceBonus(player);
    return undefined;
  }

  public canAct(player: Player): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    return turmoil.hasDelegatesInReserve(player.id) && this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const turmoil = Turmoil.getTurmoil(player.game);
    turmoil.delegateReserve.remove(player.id);
    turmoil.setNewChairman(player.id, player.game, /* setAgenda */ false);
    this.isDisabled = true;
    return undefined;
  }
}
