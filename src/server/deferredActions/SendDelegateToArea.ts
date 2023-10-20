import {IPlayer} from '../IPlayer';
import {SelectParty} from '../inputs/SelectParty';
import {DeferredAction, Priority} from './DeferredAction';
import {SelectPaymentDeferred} from './SelectPaymentDeferred';
import {Delegate, Turmoil} from '../turmoil/Turmoil';

export type Options = {
  /** The number of delegates to replace. Default is 1. */
  count?: number,
  /** If defined, this action is used to replace another player's delegates */
  replace?: Delegate | undefined,
  /** Cost for sending this delegate. Default is no cost. */
  cost?: number,
  freeStandardAction?: boolean,
}
export class SendDelegateToArea extends DeferredAction {
  private turmoil: Turmoil;

  constructor(
    player: IPlayer,
    public title: string = 'Select where to send a delegate',
    public options: Options = {},
  ) {
    super(player, Priority.DEFAULT);
    this.turmoil = Turmoil.getTurmoil(player.game);
  }

  private getAvailableParties() {
    // All parties are eligible, unless this action is used to replace a delegate.
    let parties = this.turmoil.parties;
    if (this.options.replace) {
      parties = this.turmoil.parties.filter((party) => {
        if (party.delegates.size < 2) return false;

        for (const delegate of party.delegates) {
          if (delegate !== this.options.replace) continue;
          if (delegate !== party.partyLeader) return true;
          return party.delegates.get(this.options.replace) > 1;
        }
        return false;
      });
    }

    return parties.map((party) => party.name);
  }

  public execute() {
    const availableParties = this.getAvailableParties();
    if (availableParties.length === 0) {
      return undefined;
    }
    const numDelegateToSend = this.options.count ?? 1;

    const sendDelegate = new SelectParty(this.title, 'Send delegate', availableParties)
      .andThen((partyName) => {
        if (this.options.cost) {
          this.player.game.defer(new SelectPaymentDeferred(this.player, this.options.cost, {title: 'Select how to pay for send delegate action'}));
        }

        for (let i = 0; i < numDelegateToSend; i++) {
          if (this.options.replace) {
            this.turmoil.replaceDelegateFromParty(this.options.replace, this.player.id, partyName, this.player.game);
          } else {
            this.turmoil.sendDelegateToParty(this.player.id, partyName, this.player.game);
          }
        }

        if (this.options?.freeStandardAction === true) {
          this.turmoil.usedFreeDelegateAction.add(this.player.id);
        }
        this.player.totalDelegatesPlaced += numDelegateToSend;
        this.player.game.log('${0} sent ${1} delegate(s) in ${2} area', (b) => b.player(this.player).number(numDelegateToSend).partyName(partyName));
        return undefined;
      });

    return sendDelegate;
  }
}
