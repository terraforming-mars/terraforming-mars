import {Game} from '../Game';
import {Player, PlayerId} from '../Player';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction} from './DeferredAction';
import {SelectHowToPayDeferred} from './SelectHowToPayDeferred';

export class SendDelegateToArea implements DeferredAction {
  constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select where to send a delegate',
        public nbr: number = 1,
        public replace: 'NEUTRAL' | PlayerId | undefined = undefined,
        public price: number | undefined = undefined,
        public fromLobby: boolean = true,
  ) {}

  public execute() {
    const sendDelegate = new OrOptions();
    // Change the default title
    sendDelegate.title = this.title;
    sendDelegate.buttonLabel = 'Send delegate';
    let parties;
    if (this.replace) {
      parties = this.game.turmoil!.parties.filter((party) => {
        if (party.delegates.length < 2) return false;

        for (const delegate of party.delegates) {
          if (delegate !== this.replace) continue;
          if (delegate !== party.partyLeader) return true;
          return party.delegates.filter((delegate) => delegate === this.replace).length > 1;
        }
        return false;
      });
    } else {
      parties = this.game.turmoil!.parties;
    }

    sendDelegate.options = parties.map((party) => new SelectOption(
      party.name + ' (' + party.activeBonus?.description + ')',
      'Send delegate',
      () => {
        if (this.price) {
          this.game.defer(new SelectHowToPayDeferred(this.player, this.price, false, false, 'Select how to pay for send delegate action'));
        }

        if (this.nbr > 1 && this.fromLobby) { // For card: Cultural Metropolis
                    this.game.turmoil?.sendDelegateToParty(this.player.id, party.name, this.game, true);
                    for (let i = 0; i < this.nbr - 1; i++) {
                        this.game.turmoil?.sendDelegateToParty(this.player.id, party.name, this.game, false);
                    }
        } else {
          for (let i = 0; i < this.nbr; i++) {
            if (this.replace) {
                            this.game.turmoil?.removeDelegateFromParty(this.replace, party.name, this.game);
            }
                        this.game.turmoil?.sendDelegateToParty(this.player.id, party.name, this.game, this.fromLobby);
          }
        }

        this.game.log('${0} sent ${1} delegate(s) in ${2} area', (b) => b.player(this.player).number(this.nbr).party(party));
        return undefined;
      },
    ));

    return sendDelegate;
  }
}
