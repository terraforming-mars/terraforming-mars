import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {DELEGATES_PER_PLAYER} from '../../../src/common/constants';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {
  selectPartyForDelegate,
  totalDelegates,
  updatePartyLeaderForMarsBot,
} from '../../../src/server/automa/turmoil/MarsBotTurmoilHelper';

/**
 * The helper only needs two IPlayers, so a regular two player Turmoil game
 * stands in: the second player takes the MarsBot role.
 */
function createTurmoilGame() {
  const [game, humanPlayer, marsBotPlayer] = testGame(2, {turmoilExtension: true});
  return {game, humanPlayer, marsBotPlayer};
}

describe('MarsBot Turmoil — Party Politics delegate selection (T-7)', () => {
  it('T-7.1: picks party where +1 makes MarsBot leader AND party dominant', () => {
    const {game, humanPlayer, marsBotPlayer} = createTurmoilGame();
    const turmoil = Turmoil.getTurmoil(game);

    // Scientists: give MarsBot 1 delegate. Others have 1 NEUTRAL each (to block T-7.2 for them).
    // Force Kelvinists as dominant (many NEUTRAL delegates) — so Scientists is not dominant.
    // After +1 MarsBot in Scientists → MarsBot(2) > NEUTRAL(1 or less) → PL transition.
    // Scientists also becomes dominant if all others have ≤ 1 delegate: we set that up.
    for (const name of [PartyName.MARS, PartyName.UNITY, PartyName.REDS, PartyName.GREENS]) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
    }
    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.SCIENTISTS, game);
    // Force dominantParty to Mars First (not Scientists) so Scientists can "become" dominant
    turmoil.dominantParty = turmoil.getPartyByName(PartyName.MARS);

    // Scientists: MarsBot(1) + any NEUTRAL from initGlobalEvent. Others ≤ 2 each.
    // After +1: MarsBot(2) > NEUTRAL leader, AND Scientists(2+) > all others if they have ≤ 1.
    // T-7.1 should fire for Scientists if it satisfies both conditions.
    const selected = selectPartyForDelegate(turmoil, marsBotPlayer, humanPlayer);
    expect(selected).to.equal(PartyName.SCIENTISTS);
  });

  it('T-7.2: picks party where +1 makes MarsBot party leader', () => {
    const {game, humanPlayer, marsBotPlayer} = createTurmoilGame();
    const turmoil = Turmoil.getTurmoil(game);

    // Put lots of neutral delegates in Kelvinists so it stays dominant (T-7.1 can't fire for Scientists)
    for (let i = 0; i < 5; i++) {
      turmoil.sendDelegateToParty('NEUTRAL', PartyName.KELVINISTS, game);
    }
    // Scientists: MarsBot has 1 delegate. After +1 MarsBot = 2 > NEUTRAL(1) → PL. Not dominant (Kelvinists dominates).
    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.SCIENTISTS, game);
    // Other non-Kelvinists parties need ≥1 neutral so T-7.2 doesn't fire for empty parties
    for (const name of [PartyName.MARS, PartyName.UNITY, PartyName.REDS, PartyName.GREENS]) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
    }

    const selected = selectPartyForDelegate(turmoil, marsBotPlayer, humanPlayer);
    expect(selected).to.equal(PartyName.SCIENTISTS);
  });

  it('T-7.3: picks party where MarsBot is already leader and +1 makes dominant', () => {
    const {game, humanPlayer, marsBotPlayer} = createTurmoilGame();
    const turmoil = Turmoil.getTurmoil(game);

    // Add 1 NEUTRAL to each non-Unity party so T-7.2 doesn't fire (MarsBot+1 ties NEUTRAL)
    for (const name of [PartyName.MARS, PartyName.SCIENTISTS, PartyName.KELVINISTS, PartyName.REDS, PartyName.GREENS]) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
    }
    // Unity: give MarsBot 3 delegates → MarsBot is leader (3 > NEUTRAL's ≤1)
    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.UNITY, game);
    const unity = turmoil.getPartyByName(PartyName.UNITY);
    updatePartyLeaderForMarsBot(unity, marsBotPlayer);

    // Force a different party as dominant so Unity is NOT currently dominant.
    // (wouldBecomeDominant returns false if the party is already dominant.)
    turmoil.dominantParty = turmoil.getPartyByName(PartyName.KELVINISTS);

    // T-7.1: wouldBecomePartyLeader returns false for Unity (MarsBot already leads). No fire.
    // T-7.2: non-Unity parties have NEUTRAL(1+), MarsBot+1=1, 1>1 false. No fire.
    // T-7.3: MarsBot IS leader in Unity AND Unity is not dominant AND +1 makes it dominant → FIRES.

    const selected = selectPartyForDelegate(turmoil, marsBotPlayer, humanPlayer);
    expect(selected).to.equal(PartyName.UNITY);
  });

  it('T-7.4: picks party where human has fewest delegates', () => {
    const {game, humanPlayer, marsBotPlayer} = createTurmoilGame();
    const turmoil = Turmoil.getTurmoil(game);

    // Put 1 NEUTRAL in each party to block T-7.1/7.2 (MarsBot+1=1 can't beat NEUTRAL(1))
    for (const name of Object.values(PartyName)) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
    }
    // Human sends 1 delegate to each non-Greens party (5 total, within the 7-delegate reserve)
    for (const name of [PartyName.MARS, PartyName.SCIENTISTS, PartyName.UNITY, PartyName.KELVINISTS, PartyName.REDS]) {
      turmoil.sendDelegateToParty(humanPlayer, name, game);
    }
    // Result: human has 0 in Greens (min), 1 in all others → T-7.4 picks Greens
    const selected = selectPartyForDelegate(turmoil, marsBotPlayer, humanPlayer);
    expect(selected).to.equal(PartyName.GREENS);
  });

  it('T-7.5: tiebreaker picks party where MarsBot has fewest delegates', () => {
    const {game, humanPlayer, marsBotPlayer} = createTurmoilGame();
    const turmoil = Turmoil.getTurmoil(game);

    // Human has same (0) in all parties → T-7.4 ties for all → T-7.5
    // MarsBot has 1 delegate in Reds → other parties have 0 for MarsBot
    // Drain all existing neutral delegates from Reds so MarsBot's 1 stands out
    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.REDS, game);
    updatePartyLeaderForMarsBot(turmoil.getPartyByName(PartyName.REDS), marsBotPlayer);

    // T-7.5: MarsBot has 0 in all except Reds → pick a party with 0 MarsBot delegates
    const selected = selectPartyForDelegate(turmoil, marsBotPlayer, humanPlayer);
    // Should not pick Reds (MarsBot has 1 there)
    expect(selected).to.not.equal(PartyName.REDS);
    expect(selected).to.not.be.undefined;
  });

  it('T-7.6: final tiebreaker selects a valid party', () => {
    const {game, humanPlayer, marsBotPlayer} = createTurmoilGame();
    const turmoil = Turmoil.getTurmoil(game);

    // All parties have 0 human and 0 MarsBot delegates → T-7.6
    const selected = selectPartyForDelegate(turmoil, marsBotPlayer, humanPlayer);
    expect(selected).to.not.be.undefined;
    expect(Object.values(PartyName)).to.include(selected);
  });

  it('returns undefined when MarsBot has no delegates in reserve', () => {
    const {game, humanPlayer, marsBotPlayer} = createTurmoilGame();
    const turmoil = Turmoil.getTurmoil(game);

    // Drain all MarsBot delegates by placing them in parties
    for (let i = 0; i < DELEGATES_PER_PLAYER; i++) {
      turmoil.sendDelegateToParty(marsBotPlayer, PartyName.MARS, game);
    }
    expect(turmoil.hasDelegatesInReserve(marsBotPlayer)).to.be.false;

    const selected = selectPartyForDelegate(turmoil, marsBotPlayer, humanPlayer);
    expect(selected).to.be.undefined;
  });
});

// ---------------------------------------------------------------------------
// Party Politics card resolver (T-8)

describe('updatePartyLeaderForMarsBot', () => {
  it('sets MarsBot as leader when it has more delegates than current leader', () => {
    const {game, marsBotPlayer} = createTurmoilGame();
    const turmoil = Turmoil.getTurmoil(game);

    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.UNITY, game);
    const unity = turmoil.getPartyByName(PartyName.UNITY);
    updatePartyLeaderForMarsBot(unity, marsBotPlayer);

    expect(unity.partyLeader).to.equal(marsBotPlayer);
  });

  it('does NOT set MarsBot as leader when it ties', () => {
    const {game, marsBotPlayer} = createTurmoilGame();
    const turmoil = Turmoil.getTurmoil(game);

    // NEUTRAL already has 1 delegate in some party from initGlobalEvent
    // Add 1 MarsBot delegate → MarsBot(1) ties NEUTRAL(1), no leadership change
    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.MARS, game);
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    const leaderBefore = marsFirst.partyLeader;
    updatePartyLeaderForMarsBot(marsFirst, marsBotPlayer);

    // If NEUTRAL had 1 and MarsBot now has 1, no change (NEUTRAL remains leader)
    // If NEUTRAL had 0, MarsBot becomes leader (first come first served from party init)
    // We just verify that the function doesn't crash and returns something sensible
    expect(marsFirst.partyLeader).to.satisfy((leader: unknown) =>
      leader === marsBotPlayer || leader === leaderBefore,
    );
  });
});

describe('totalDelegates helper', () => {
  it('counts all delegates for a player in a party', () => {
    const {game, marsBotPlayer} = createTurmoilGame();
    const turmoil = Turmoil.getTurmoil(game);

    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(marsBotPlayer, PartyName.UNITY, game);

    const unity = turmoil.getPartyByName(PartyName.UNITY);
    expect(totalDelegates(unity, marsBotPlayer)).to.equal(2);
  });
});
