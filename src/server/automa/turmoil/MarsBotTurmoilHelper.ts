import {Turmoil} from '../../turmoil/Turmoil';
import {IParty} from '../../turmoil/parties/IParty';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IPlayer} from '../../IPlayer';
import {IGame} from '../../IGame';

/**
 * T-7: Select which party MarsBot should place a delegate into.
 *
 * Uses a NARROWING approach: each tier restricts the candidate set.
 * If a tier yields no matches within the current candidates, the candidate
 * set is left unchanged and the next tier is applied.
 *
 *  Tier 1: Party where +1 makes MarsBot become Party Leader AND the party become Dominant.
 *  Tier 2: Party where +1 makes MarsBot become Party Leader.
 *  Tier 3: Party where MarsBot is already Party Leader, and +1 makes it become Dominant
 *          (party must NOT already be Dominant — both conditions require a state transition).
 *  Tier 4: Party where the human player has fewest delegates (incl. zero).
 *  Tier 5: Party where MarsBot has fewest delegates (incl. zero).
 *  Tier 6: Next party clockwise from the Dominance marker (circling around). Always yields 1.
 */
export function selectPartyForDelegate(
  turmoil: Turmoil,
  marsBotPlayer: IPlayer,
  humanPlayer: IPlayer,
): PartyName | undefined {
  if (!turmoil.hasDelegatesInReserve(marsBotPlayer)) {
    return undefined;
  }

  const allParties = turmoil.parties as ReadonlyArray<IParty>;
  let candidates: ReadonlyArray<IParty> = allParties;

  // Tier 1: +1 → MarsBot becomes PL AND party becomes Dominant (both transitions)
  candidates = narrow(candidates, (p) =>
    wouldBecomePartyLeader(p, marsBotPlayer) && wouldBecomeDominant(turmoil, p, allParties),
  );

  // Tier 2: +1 → MarsBot becomes Party Leader
  candidates = narrow(candidates, (p) => wouldBecomePartyLeader(p, marsBotPlayer));

  // Tier 3: MarsBot is already PL AND +1 → party becomes Dominant (not already dominant)
  candidates = narrow(candidates, (p) =>
    p.partyLeader === marsBotPlayer && wouldBecomeDominant(turmoil, p, allParties),
  );

  // Tier 4: party where human has fewest delegates (minimum is always reached — no empty result)
  const minHuman = Math.min(...candidates.map((p) => totalDelegates(p, humanPlayer)));
  candidates = narrow(candidates, (p) => totalDelegates(p, humanPlayer) === minHuman);

  // Tier 5: party where MarsBot has fewest delegates
  const minMarsBot = Math.min(...candidates.map((p) => totalDelegates(p, marsBotPlayer)));
  candidates = narrow(candidates, (p) => totalDelegates(p, marsBotPlayer) === minMarsBot);

  // Tier 6: sort remaining candidates by clockwise distance from dominant; pick nearest
  const dominantIndex = allParties.indexOf(turmoil.dominantParty);
  const sorted = [...candidates].sort((a, b) => {
    const distA = clockwiseDistance(dominantIndex, allParties.indexOf(a), allParties.length);
    const distB = clockwiseDistance(dominantIndex, allParties.indexOf(b), allParties.length);
    return distA - distB;
  });

  return sorted[0]?.name;
}

/**
 * Narrowing helper: if any party in `candidates` passes `predicate`, return only those.
 * Otherwise return `candidates` unchanged.
 */
function narrow(
  candidates: ReadonlyArray<IParty>,
  predicate: (p: IParty) => boolean,
): ReadonlyArray<IParty> {
  const filtered = candidates.filter(predicate);
  return filtered.length >= 1 ? filtered : candidates;
}

/**
 * T-7 + game engine: Place 1 MarsBot delegate from reserve into the selected party.
 * Returns the party name the delegate was placed in, or undefined if no reserve.
 */
export function placeDelegateForMarsBot(
  turmoil: Turmoil,
  marsBotPlayer: IPlayer,
  humanPlayer: IPlayer,
  game: IGame,
): PartyName | undefined {
  const partyName = selectPartyForDelegate(turmoil, marsBotPlayer, humanPlayer);
  if (partyName === undefined) {
    return undefined;
  }
  turmoil.sendDelegateToParty(marsBotPlayer, partyName, game);
  // Party.checkPartyLeader only considers game.playersInGenerationOrder + NEUTRAL, not MarsBot.
  // Manually update the party leader if MarsBot now has the most delegates.
  const party = turmoil.getPartyByName(partyName);
  updatePartyLeaderForMarsBot(party, marsBotPlayer);
  game.log('MarsBot places delegate in ${0} (Party Politics)', (b) => b.partyName(partyName));
  return partyName;
}

/**
 * After placing a MarsBot delegate, set MarsBot as party leader if it now has
 * strictly more delegates than the current leader.
 *
 * The Party class's checkPartyLeader only iterates game.playersInGenerationOrder + NEUTRAL.
 * MarsBot is not in that list, so we must update leadership manually.
 */
export function updatePartyLeaderForMarsBot(party: IParty, marsBotPlayer: IPlayer): void {
  const marsBotCount = party.delegates.get(marsBotPlayer);
  if (marsBotCount === 0) {
    return;
  }
  const leaderCount = party.partyLeader !== undefined ?
    party.delegates.get(party.partyLeader) :
    0;
  if (marsBotCount > leaderCount) {
    party.partyLeader = marsBotPlayer;
  }
}

/** Count all delegates for `player` in `party`. */
export function totalDelegates(party: IParty, player: IPlayer): number {
  return party.delegates.get(player);
}

/**
 * Would placing 1 MarsBot delegate make MarsBot the Party Leader of `party`?
 * Requires MarsBot is NOT already the party leader (a genuine transition),
 * and after placement MarsBot would have strictly more delegates than the current leader.
 */
function wouldBecomePartyLeader(party: IParty, marsBotPlayer: IPlayer): boolean {
  // MarsBot already leads — Tier 3 handles this case
  if (party.partyLeader === marsBotPlayer) {
    return false;
  }

  const currentLeaderCount = party.partyLeader !== undefined ?
    party.delegates.get(party.partyLeader) :
    0;
  const marsBotCountAfter = party.delegates.get(marsBotPlayer) + 1;

  return marsBotCountAfter > currentLeaderCount;
}

/**
 * Would placing 1 delegate in `party` make it the new Dominant party?
 * The party must NOT already be Dominant (condition requires a state transition).
 * After placement, the party must have strictly more delegates than all others.
 */
function wouldBecomeDominant(
  turmoil: Turmoil,
  party: IParty,
  allParties: ReadonlyArray<IParty>,
): boolean {
  // Must not already be the dominant party ("becomes" implies a transition)
  if (turmoil.dominantParty === party) {
    return false;
  }
  const partyCountAfter = party.delegates.size + 1;
  return allParties.every((p) => p === party || p.delegates.size < partyCountAfter);
}

/**
 * Clockwise distance from `fromIndex` to `toIndex` in a circular array of `size`.
 * Clockwise = decreasing-index direction (consistent with Turmoil.setNextPartyAsDominant).
 * Distance from a party to itself is `size` (to put it last in clockwise sort).
 */
function clockwiseDistance(fromIndex: number, toIndex: number, size: number): number {
  if (fromIndex === toIndex) {
    return size;
  } // same party — put last
  return (fromIndex - toIndex + size) % size;
}
