import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {DELEGATES_FOR_NEUTRAL_PLAYER} from '../../../common/constants';

import {Turmoil} from '../../turmoil/Turmoil';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {SelectParty} from '../../inputs/SelectParty';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';

export class Petra extends CeoCard {
  constructor() {
    super({
      name: CardName.PETRA,
      metadata: {
        cardNumber: 'L16',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br;
          b.text('REPLACE ALL NEUTRAL', Size.TINY).delegates(1).colon().megacredits(3).asterix();
          b.br.br;
          b.plus().delegates(3).asterix;
        }),
        description: 'Once per game, replace all Neutral delegates with your delegates. Gain 3 M€ for each delegate replaced this way. Place 3 Neutral delegates.',
      },
    });
  }

  public override canAct(player: IPlayer): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    // We need to make sure that the player has enough delegates available to replace ALL neuts.
    //  including Chairman!
    const turmoil = player.game.turmoil;
    if (turmoil === undefined || this.isDisabled === true) return false;
    const numNeutralDelegates = DELEGATES_FOR_NEUTRAL_PLAYER - turmoil.getAvailableDelegateCount('NEUTRAL');
    const playerTotalDelegateCount = turmoil.getAvailableDelegateCount(player);
    return playerTotalDelegateCount >= numNeutralDelegates;
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;

    const turmoil = player.game.turmoil as Turmoil;

    let count = 0; // How many delegates were swapped out

    // Replace all neutral delegates in all parties
    for (const party of turmoil.parties) {
      const neutralDelegates = party.delegates.count('NEUTRAL');
      for (let i = 0; i < neutralDelegates; i++) {
        // Add the delegate _before_ removing the Neutral, otherwise we get errors when it
        // attempts to find the new party leader if there are no remaining members in the party.
        turmoil.sendDelegateToParty(player, party.name, player.game);
        turmoil.removeDelegateFromParty('NEUTRAL', party.name, player.game);
        // This would be nice to use:
        // turmoil.replaceDelegateFromParty('NEUTRAL', player.id, party.name, player.game);
        // but it generates errors if the party only has the single Neutral member

        // Check dominance after every replacement
        turmoil.checkDominantParty();
      }
      count += neutralDelegates;
    }

    // Replace chairman if it is neutral
    if (turmoil.chairman === 'NEUTRAL') {
      turmoil.setNewChairman(player, player.game, /* setAgenda */ false);
      turmoil.delegateReserve.remove(player);
      count += 1;
    }
    // If we dont do this player will not get the bonus for POLITICAN Awards
    player.totalDelegatesPlaced += count;
    player.stock.add(Resource.MEGACREDITS, count * 3, {log: true});

    // Place 3 Neutral delegates
    const availableParties = turmoil.parties.map((party) => party.name);
    const title = 'Select where to send a Neutral delegate';
    const previousDominantParty = turmoil.dominantParty.name;

    for (let i = 0; i < 3; i++) {
      player.game.defer(new SimpleDeferredAction(player, () => {
        return new SelectParty(title, 'Send delegate', availableParties)
          .andThen((partyName) => {
            turmoil.sendDelegateToParty('NEUTRAL', partyName, player.game);
            player.game.log('${0} sent ${1} Neutral delegate in ${2} area', (b) => b.player(player).number(1).party(turmoil.getPartyByName(partyName)));
            return undefined;
          });
      }));
    }

    if (turmoil.dominantParty.name !== previousDominantParty) {
      player.game.log('${0} is the new dominant party', (b) => b.string(turmoil.dominantParty.name));
    }
    return undefined;
  }
}
