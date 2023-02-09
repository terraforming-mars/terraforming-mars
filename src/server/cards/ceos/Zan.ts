import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Turmoil} from '../../turmoil/Turmoil';

export class Zan extends CeoCard {
  constructor() {
    super({
      name: CardName.ZAN,
      metadata: {
        cardNumber: 'L26',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          // b.redsInactive().asterix();
          b.text('(NoRedsNeg)').asterix();
          b.br.br;
          // b.opgArrow().text('ALL').delegates(1).colon().nbsp.nbsp.party(PartyName.REDS);
          b.opgArrow().text('ALL').delegates(1).colon().text('REDS');
        }),
        description: 'You are immune to Reds\' ruling policy. Once per game, place all of your available delegates in Reds.',
      },
    });
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);
    while (turmoil.getAvailableDelegateCount(player.id) > 0) {
      turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
    }
    this.isDisabled = true;
    return undefined;
  }
}
