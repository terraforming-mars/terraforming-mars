import {Turmoil} from '@/server/turmoil/Turmoil';
import {IParty} from '@/server/turmoil/parties/IParty';
import {PartyName} from '@/common/turmoil/PartyName';
import {IPlayer} from '@/server/IPlayer';
import {IGame} from '@/server/IGame';
import {pickByFlippedCard} from '@/server/automa/MarsBotCardFlip';

/** MarsBot's delegate placement in an automa game (Party Politics, rulebook C p.6). */
export class MarsBotTurmoilHelper {
  private readonly turmoil: Turmoil;
  private readonly marsBotPlayer: IPlayer;
  private readonly humanPlayer: IPlayer;

  constructor(private readonly game: IGame) {
    if (game.marsBotPlayer === undefined) {
      throw new Error('MarsBotTurmoilHelper needs an automa game');
    }
    this.turmoil = Turmoil.getTurmoil(game);
    this.marsBotPlayer = game.marsBotPlayer;
    this.humanPlayer = game.players[0];
  }

  /**
   * Chooses the party for MarsBot's next delegate, or undefined when its reserve is empty.
   *
   * Each tier breaks the tie left by the one before it:
   *  1. one more delegate makes MarsBot the party leader and the party dominant
   *  2. one more delegate makes MarsBot the party leader
   *  3. MarsBot already leads and one more delegate makes the party dominant
   *  4. the human player has the fewest delegates there
   *  5. MarsBot has the fewest delegates there
   *  6. the next party clockwise from the dominance marker
   */
  public selectParty(): PartyName | undefined {
    if (!this.turmoil.delegateReserve.has(this.marsBotPlayer)) {
      return undefined;
    }

    let candidates = narrow(this.turmoil.parties, (party) =>
      this.wouldBecomePartyLeader(party) && this.wouldBecomeDominant(party));

    candidates = narrow(candidates, (party) => this.wouldBecomePartyLeader(party));

    candidates = narrow(candidates, (party) =>
      party.partyLeader === this.marsBotPlayer && this.wouldBecomeDominant(party));

    candidates = fewestDelegates(candidates, this.humanPlayer);
    candidates = fewestDelegates(candidates, this.marsBotPlayer);

    const parties = this.turmoil.parties;
    const dominantIndex = parties.indexOf(this.turmoil.dominantParty);
    const nearest = candidates.toSorted((a, b) =>
      clockwiseDistance(dominantIndex, parties.indexOf(a), parties.length) -
      clockwiseDistance(dominantIndex, parties.indexOf(b), parties.length));

    return nearest[0].name;
  }

  /**
   * Chooses the party for a Gray Eminence delegate (Septem Tribus): the fewest MarsBot
   * delegates, then the fewest player delegates, then a random party by flipping a project card.
   */
  public selectGrayEminenceParty(): PartyName {
    let candidates = fewestDelegates(this.turmoil.parties, this.marsBotPlayer);
    candidates = fewestDelegates(candidates, this.humanPlayer);
    if (candidates.length === 1) {
      return candidates[0].name;
    }
    return (pickByFlippedCard(this.game, candidates) ?? candidates[0]).name;
  }

  /**
   * Sends one delegate from MarsBot's reserve to the party it picks.
   *
   * Returns the party it went to, or undefined when the reserve is empty.
   */
  public maybePlaceDelegate(): PartyName | undefined {
    const partyName = this.selectParty();
    if (partyName === undefined) {
      return undefined;
    }
    this.turmoil.sendDelegateToParty(this.marsBotPlayer, partyName, this.game);
    this.game.log('${0} added a delegate in ${1}', (b) => b.player(this.marsBotPlayer).partyName(partyName));
    return partyName;
  }

  /** Whether one more MarsBot delegate makes MarsBot the party leader, when it doesn't lead already. */
  private wouldBecomePartyLeader(party: IParty): boolean {
    if (party.partyLeader === this.marsBotPlayer) {
      return false;
    }
    const leaderCount = party.partyLeader === undefined ? 0 : party.delegates.get(party.partyLeader);
    return party.delegates.get(this.marsBotPlayer) + 1 > leaderCount;
  }

  /** Whether one more delegate makes `party` the dominant party, when it isn't dominant already. */
  private wouldBecomeDominant(party: IParty): boolean {
    if (this.turmoil.dominantParty === party) {
      return false;
    }
    const countAfter = party.delegates.size + 1;
    return this.turmoil.parties.every((other) => other === party || other.delegates.size < countAfter);
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

/** Keeps the parties where `player` has the fewest delegates. */
function fewestDelegates(candidates: ReadonlyArray<IParty>, player: IPlayer): ReadonlyArray<IParty> {
  const fewest = Math.min(...candidates.map((party) => party.delegates.get(player)));
  return candidates.filter((party) => party.delegates.get(player) === fewest);
}

/**
 * Counts the clockwise steps from `fromIndex` to `toIndex` around `size` parties.
 *
 * Clockwise runs towards lower indexes, like `Turmoil.setNextPartyAsDominant`, and a party is `size` steps from itself.
 */
function clockwiseDistance(fromIndex: number, toIndex: number, size: number): number {
  if (fromIndex === toIndex) {
    return size;
  }
  return (fromIndex - toIndex + size) % size;
}
