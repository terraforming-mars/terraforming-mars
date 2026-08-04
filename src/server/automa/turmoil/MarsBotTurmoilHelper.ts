import {Turmoil} from '../../turmoil/Turmoil';
import {IParty} from '../../turmoil/parties/IParty';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IPlayer} from '../../IPlayer';
import {IGame} from '../../IGame';

/**
 * Places MarsBot's delegates and keeps its party leadership up to date.
 *
 * Party.checkPartyLeader only considers game.playersInGenerationOrder plus NEUTRAL, and MarsBot
 * is in neither, so leadership has to be applied here instead.
 */
export class MarsBotTurmoilHelper {
  constructor(
    private readonly game: IGame,
    private readonly turmoil: Turmoil,
    private readonly marsBotPlayer: IPlayer,
    private readonly humanPlayer: IPlayer,
  ) {}

  /**
   * Chooses the party for MarsBot's next delegate, or undefined when its reserve is empty (T-7).
   *
   * Each tier narrows the candidates. A tier that matches nothing leaves the candidates alone
   * and the next tier runs against the same set.
   *
   *  Tier 1: Party where +1 makes MarsBot become Party Leader AND the party become Dominant.
   *  Tier 2: Party where +1 makes MarsBot become Party Leader.
   *  Tier 3: Party where MarsBot is already Party Leader, and +1 makes it become Dominant
   *          (the party must NOT already be Dominant, since both conditions are transitions).
   *  Tier 4: Party where the human player has fewest delegates (including zero).
   *  Tier 5: Party where MarsBot has fewest delegates (including zero).
   *  Tier 6: Next party clockwise from the Dominance marker, circling around. Always yields one.
   */
  public selectParty(): PartyName | undefined {
    if (!this.turmoil.hasDelegatesInReserve(this.marsBotPlayer)) {
      return undefined;
    }

    const allParties = this.turmoil.parties;
    let candidates = allParties;

    candidates = narrow(candidates, (party) =>
      this.wouldBecomePartyLeader(party) && this.wouldBecomeDominant(party));

    candidates = narrow(candidates, (party) => this.wouldBecomePartyLeader(party));

    candidates = narrow(candidates, (party) =>
      party.partyLeader === this.marsBotPlayer && this.wouldBecomeDominant(party));

    const fewestHuman = Math.min(...candidates.map((party) => party.delegates.get(this.humanPlayer)));
    candidates = narrow(candidates, (party) => party.delegates.get(this.humanPlayer) === fewestHuman);

    const fewestMarsBot = Math.min(...candidates.map((party) => party.delegates.get(this.marsBotPlayer)));
    candidates = narrow(candidates, (party) => party.delegates.get(this.marsBotPlayer) === fewestMarsBot);

    const dominantIndex = allParties.indexOf(this.turmoil.dominantParty);
    const nearest = [...candidates].sort((a, b) =>
      clockwiseDistance(dominantIndex, allParties.indexOf(a), allParties.length) -
      clockwiseDistance(dominantIndex, allParties.indexOf(b), allParties.length));

    return nearest[0]?.name;
  }

  /**
   * Sends one delegate from MarsBot's reserve to the party it picks (T-7).
   * Returns the party it went to, or undefined when the reserve is empty.
   */
  public maybePlaceDelegate(): PartyName | undefined {
    const partyName = this.selectParty();
    if (partyName === undefined) {
      return undefined;
    }
    this.turmoil.sendDelegateToParty(this.marsBotPlayer, partyName, this.game);
    this.maybeUpdatePartyLeader(this.turmoil.getPartyByName(partyName));
    this.game.log('${0} added a delegate in ${1}', (b) => b.player(this.marsBotPlayer).partyName(partyName));
    return partyName;
  }

  /** Makes MarsBot the party leader when it now holds strictly more delegates than the current leader. */
  public maybeUpdatePartyLeader(party: IParty): void {
    const marsBotCount = party.delegates.get(this.marsBotPlayer);
    if (marsBotCount === 0) {
      return;
    }
    if (marsBotCount > this.leaderCount(party)) {
      party.partyLeader = this.marsBotPlayer;
    }
  }

  /**
   * Would placing one MarsBot delegate make MarsBot the Party Leader?
   * MarsBot must not already lead, so that this is a genuine transition.
   */
  private wouldBecomePartyLeader(party: IParty): boolean {
    if (party.partyLeader === this.marsBotPlayer) {
      return false;
    }
    return party.delegates.get(this.marsBotPlayer) + 1 > this.leaderCount(party);
  }

  /**
   * Would placing one delegate make this party the new Dominant party?
   * The party must not already be Dominant, since "becomes" implies a transition.
   */
  private wouldBecomeDominant(party: IParty): boolean {
    if (this.turmoil.dominantParty === party) {
      return false;
    }
    const countAfter = party.delegates.size + 1;
    return this.turmoil.parties.every((other) => other === party || other.delegates.size < countAfter);
  }

  private leaderCount(party: IParty): number {
    return party.partyLeader !== undefined ? party.delegates.get(party.partyLeader) : 0;
  }
}

/** Keeps the parties that pass the predicate, or all of them when none does. */
function narrow(
  candidates: ReadonlyArray<IParty>,
  predicate: (party: IParty) => boolean,
): ReadonlyArray<IParty> {
  const filtered = candidates.filter(predicate);
  return filtered.length > 0 ? filtered : candidates;
}

/**
 * Clockwise distance from `fromIndex` to `toIndex` in a circular array of `size`.
 * Distance from a party to itself is `size`, which sorts it last.
 */
function clockwiseDistance(fromIndex: number, toIndex: number, size: number): number {
  if (fromIndex === toIndex) {
    return size;
  }
  // Clockwise runs towards lower indexes, matching Turmoil.setNextPartyAsDominant.
  return (fromIndex - toIndex + size) % size;
}
