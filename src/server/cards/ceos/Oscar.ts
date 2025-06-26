import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {Turmoil} from '../../turmoil/Turmoil';

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
    // Increase totalDelegatesPlaced manually since we're not using SendDeletageToArea()
    // If we dont do this player will not get the bonus for POLITICAN Awards
    player.totalDelegatesPlaced += 1;
    this.isDisabled = true;
    return undefined;
  }
}
