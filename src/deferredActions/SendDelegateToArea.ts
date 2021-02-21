import {Player, PlayerId} from '../Player';
import {SelectPartyToSendDelegate} from '../inputs/SelectPartyToSendDelegate';
import {DeferredAction, Priority} from './DeferredAction';
import {SelectHowToPayDeferred} from './SelectHowToPayDeferred';
import {NeutralPlayer} from '../turmoil/Turmoil';
import {PartyName} from '../turmoil/parties/PartyName';

export class SendDelegateToArea implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
        public player: Player,
        public title: string = 'Select where to send a delegate',
        public options: SendDelegateToArea.Options = {},
  ) {}

  public execute() {
    const turmoil = this.player.game.turmoil;
    if (turmoil === undefined) {
      throw new Error(`Turmoil not defined in game ${this.player.game.id}`);
    }

    // All parties are eligible, unless this action is used to replace a delegate.
    let parties = turmoil.parties;
    if (this.options.replace) {
      parties = turmoil.parties.filter((party) => {
        if (party.delegates.length < 2) return false;

        for (const delegate of party.delegates) {
          if (delegate !== this.options.replace) continue;
          if (delegate !== party.partyLeader) return true;
          return party.delegates.filter((delegate) => delegate === this.options.replace).length > 1;
        }
        return false;
      });
    } else {
      parties = turmoil.parties;
    }

    // How many delegate to send
    const numDelegateToSend = this.options.count || 1;

    const availableParties = parties.map((party) => party.name);

    const sendDelegate = new SelectPartyToSendDelegate(this.title, 'Send delegate', availableParties, (partyName: PartyName) => {
      if (this.options.cost) {
        this.player.game.defer(new SelectHowToPayDeferred(this.player, this.options.cost, {title: 'Select how to pay for send delegate action'}));
      }

      const source = this.options.source || 'lobby';
      if (numDelegateToSend > 1 && source === 'lobby') { // For card: Cultural Metropolis
        turmoil.sendDelegateToParty(this.player.id, partyName, this.player.game, 'lobby');
        for (let i = 0; i < numDelegateToSend - 1; i++) {
          turmoil.sendDelegateToParty(this.player.id, partyName, this.player.game, 'reserve');
        }
      } else {
        for (let i = 0; i < numDelegateToSend; i++) {
          if (this.options.replace) {
            turmoil.removeDelegateFromParty(this.options.replace, partyName, this.player.game);
          }
          turmoil.sendDelegateToParty(this.player.id, partyName, this.player.game, source);
        }
      }

      this.player.game.log('${0} sent ${1} delegate(s) in ${2} area', (b) => b.player(this.player).number(numDelegateToSend).party(turmoil.getPartyByName(partyName)));
      return undefined;
    });

    return sendDelegate;
  }
}

export namespace SendDelegateToArea {
  export interface Options {
    /** The number of delegates to replace. Default is 1. */
    count?: number,
    /** If defined, this action is used to replace another player's delegates */
    replace?: PlayerId | NeutralPlayer | undefined,
    /** Cost for sending this delegate. Default is no cost. */
    cost?: number,
    /** Source of the delegates being added. Default is 'lobby' */
    source?: 'lobby' | 'reserve'
  }
}
