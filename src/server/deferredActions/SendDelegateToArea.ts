import {Player} from '../Player';
import {PlayerId} from '../../common/Types';
import {SelectPartyToSendDelegate} from '../inputs/SelectPartyToSendDelegate';
import {DeferredAction, Priority} from './DeferredAction';
import {SelectPaymentDeferred} from './SelectPaymentDeferred';
import {NeutralPlayer, Turmoil} from '../turmoil/Turmoil';
import {PartyName} from '../../common/turmoil/PartyName';

export type Options = {
  /** The number of delegates to replace. Default is 1. */
  count?: number,
  /** If defined, this action is used to replace another player's delegates */
  replace?: PlayerId | NeutralPlayer | undefined,
  /** Cost for sending this delegate. Default is no cost. */
  cost?: number,
  /** Source of the delegates being added. Default is 'lobby' */
  source?: 'lobby' | 'reserve'
}
export class SendDelegateToArea extends DeferredAction {
  private turmoil: Turmoil;

  constructor(
    player: Player,
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
        if (party.delegates.length < 2) return false;

        for (const delegate of party.delegates) {
          if (delegate !== this.options.replace) continue;
          if (delegate !== party.partyLeader) return true;
          return party.delegates.filter((delegate) => delegate === this.options.replace).length > 1;
        }
        return false;
      });
    } else {
      parties = this.turmoil.parties;
    }

    return parties.map((party) => party.name);
  }

  public execute() {
    const availableParties = this.getAvailableParties();
    if (availableParties.length === 0) {
      return undefined;
    }
    // How many delegate to send
    const numDelegateToSend = this.options.count ?? 1;

    const sendDelegate = new SelectPartyToSendDelegate(this.title, 'Send delegate', availableParties, (partyName: PartyName) => {
      if (this.options.cost) {
        this.player.game.defer(new SelectPaymentDeferred(this.player, this.options.cost, {title: 'Select how to pay for send delegate action'}));
      }

      const source = this.options.source || 'lobby';
      if (numDelegateToSend > 1 && source === 'lobby') { // For card: Cultural Metropolis
        this.turmoil.sendDelegateToParty(this.player.id, partyName, this.player.game, 'lobby');
        for (let i = 0; i < numDelegateToSend - 1; i++) {
          this.turmoil.sendDelegateToParty(this.player.id, partyName, this.player.game, 'reserve');
        }
      } else {
        for (let i = 0; i < numDelegateToSend; i++) {
          if (this.options.replace) {
            this.turmoil.replaceDelegateFromParty(this.options.replace, this.player.id, source, partyName, this.player.game);
          } else {
            this.turmoil.sendDelegateToParty(this.player.id, partyName, this.player.game, source);
          }
        }
      }

      this.player.totalDelegatesPlaced += numDelegateToSend;
      this.player.game.log('${0} sent ${1} delegate(s) in ${2} area', (b) => b.player(this.player).number(numDelegateToSend).partyName(partyName));
      return undefined;
    });

    return sendDelegate;
  }
}
