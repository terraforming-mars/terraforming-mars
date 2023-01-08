import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from './LeaderCard';
import {PartyName} from '../../../common/turmoil/PartyName';

import {Turmoil} from '../../turmoil/Turmoil';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';

export class Zan extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.ZAN,
      cardType: CardType.LEADER,
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
        description: 'You are immune to Reds\' ruling policy. Once per game, place all your delegates in Reds.',
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
    const turmoil = Turmoil.getTurmoil(game);
    // const reserveDelegates = turmoil.delegateReserve.filter((d) => d === player.id).length;
    const reserveDelegates = turmoil.getAvailableDelegateCount(player.id);
    for (let i = 0; i < reserveDelegates; i++) {
      game.defer(new SimpleDeferredAction(player, () => {
        turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
        return undefined;
      }));
    }

    this.isDisabled = true;
    return undefined;
  }
}
