import {CardName} from '@/common/cards/CardName';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {CeoCard} from '@/server/cards/ceos/CeoCard';

import {Turmoil} from '@/server/turmoil/Turmoil';

export class Oscar extends CeoCard {
  constructor() {
    super({
      name: CardName.OSCAR,
      metadata: {
        cardNumber: 'L15',
        renderData: CardRenderer.builder((b) => {
          b.effect('You have +1 influence', (eb) => eb.startEffect.influence());
          b.br.br;
          b.opgArrow().chairman();
        }),
        description: 'Once per game, replace the Chairman with one of your delegates.',
      },
    });
  }

  public override play(player: IPlayer) {
    const turmoil = player.game.turmoil;
    if (turmoil) turmoil.addInfluenceBonus(player);
    return undefined;
  }

  public override canAct(player: IPlayer): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    const turmoil = Turmoil.getTurmoil(player.game);
    return turmoil.hasDelegatesInReserve(player) && turmoil.chairman !== player;
  }

  public action(player: IPlayer): PlayerInput | undefined {
    const turmoil = Turmoil.getTurmoil(player.game);
    turmoil.setNewChairman(player, player.game, /* setAgenda*/false, /* gainTR*/false);
    turmoil.delegateReserve.remove(player);
    // Increase totalDelegatesPlaced manually since we're not using SendDelegateToArea()
    // If we dont do this player will not get the bonus for POLITICIAN Awards
    player.totalDelegatesPlaced += 1;
    this.isDisabled = true;
    return undefined;
  }
}
