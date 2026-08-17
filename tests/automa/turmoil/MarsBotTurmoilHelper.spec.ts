import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {DELEGATES_PER_PLAYER} from '../../../src/common/constants';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {MarsBotTurmoilHelper} from '../../../src/server/automa/turmoil/MarsBotTurmoilHelper';

/**
 * Builds a Turmoil automa game. The game's own setup creates the MarsBot player, which is
 * deliberately not in game.players, and seeds its delegate reserve.
 */
function createTurmoilGame() {
  const [game, humanPlayer] = testGame(1, {automaOption: true, turmoilExtension: true});
  const turmoil = Turmoil.getTurmoil(game);
  const marsBotPlayer = game.automaHooks!.marsBotPlayer;
  const helper = new MarsBotTurmoilHelper(game);
  return {game, turmoil, humanPlayer, marsBotPlayer, helper};
}

describe('MarsBotTurmoilHelper', () => {
  describe('selectParty (T-7)', () => {
    it('T-7.1: picks party where +1 makes MarsBot leader AND party dominant', () => {
      const {game, turmoil, marsBotPlayer, helper} = createTurmoilGame();

      // Scientists: give MarsBot 1 delegate. Others have 1 NEUTRAL each (to block T-7.2 for them).
      for (const name of [PartyName.MARS, PartyName.UNITY, PartyName.REDS, PartyName.GREENS]) {
        turmoil.sendDelegateToParty('NEUTRAL', name, game);
      }
      turmoil.sendDelegateToParty(marsBotPlayer, PartyName.SCIENTISTS, game);
      // Force dominantParty to Mars First (not Scientists) so Scientists can "become" dominant
      turmoil.dominantParty = turmoil.getPartyByName(PartyName.MARS);

      expect(helper.selectParty()).to.equal(PartyName.SCIENTISTS);
    });

    it('T-7.2: picks party where +1 makes MarsBot party leader', () => {
      const {game, turmoil, marsBotPlayer, helper} = createTurmoilGame();

      // Kelvinists stays dominant, so T-7.1 cannot fire for Scientists
      for (let i = 0; i < 5; i++) {
        turmoil.sendDelegateToParty('NEUTRAL', PartyName.KELVINISTS, game);
      }
      turmoil.sendDelegateToParty(marsBotPlayer, PartyName.SCIENTISTS, game);
      for (const name of [PartyName.MARS, PartyName.UNITY, PartyName.REDS, PartyName.GREENS]) {
        turmoil.sendDelegateToParty('NEUTRAL', name, game);
      }

      expect(helper.selectParty()).to.equal(PartyName.SCIENTISTS);
    });

    it('T-7.3: picks party where MarsBot is already leader and +1 makes dominant', () => {
      const {game, turmoil, marsBotPlayer, helper} = createTurmoilGame();

      // 1 NEUTRAL in each non-Unity party so T-7.2 cannot fire (MarsBot+1 only ties NEUTRAL)
      for (const name of [PartyName.MARS, PartyName.SCIENTISTS, PartyName.KELVINISTS, PartyName.REDS, PartyName.GREENS]) {
        turmoil.sendDelegateToParty('NEUTRAL', name, game);
      }
      // Unity: MarsBot leads with 3 delegates
      for (let i = 0; i < 3; i++) {
        turmoil.sendDelegateToParty(marsBotPlayer, PartyName.UNITY, game);
      }
      // Unity must not already be dominant, since wouldBecomeDominant needs a transition
      turmoil.dominantParty = turmoil.getPartyByName(PartyName.KELVINISTS);

      expect(helper.selectParty()).to.equal(PartyName.UNITY);
    });

    it('T-7.3 needs a transition, so it skips a party that is already dominant', () => {
      const {game, turmoil, marsBotPlayer, helper} = createTurmoilGame();

      // A NEUTRAL delegate everywhere blocks tiers 1 and 2. MarsBot leads Unity, and Unity
      // is already dominant, so tier 3 has no transition left to make and must pass it over.
      for (const name of Object.values(PartyName)) {
        turmoil.sendDelegateToParty('NEUTRAL', name, game);
      }
      for (let i = 0; i < 3; i++) {
        turmoil.sendDelegateToParty(marsBotPlayer, PartyName.UNITY, game);
      }
      const unity = turmoil.getPartyByName(PartyName.UNITY);
      expect(unity.partyLeader).to.equal(marsBotPlayer);
      turmoil.dominantParty = unity;

      expect(helper.selectParty()).to.not.equal(PartyName.UNITY);
    });

    it('T-7.4: picks party where human has fewest delegates', () => {
      const {game, turmoil, humanPlayer, helper} = createTurmoilGame();

      // 1 NEUTRAL everywhere blocks T-7.1 and T-7.2
      for (const name of Object.values(PartyName)) {
        turmoil.sendDelegateToParty('NEUTRAL', name, game);
      }
      for (const name of [PartyName.MARS, PartyName.SCIENTISTS, PartyName.UNITY, PartyName.KELVINISTS, PartyName.REDS]) {
        turmoil.sendDelegateToParty(humanPlayer, name, game);
      }

      // The human holds none in Greens and one everywhere else
      expect(helper.selectParty()).to.equal(PartyName.GREENS);
    });

    it('T-7.5: tiebreaker picks party where MarsBot has fewest delegates', () => {
      const {game, turmoil, marsBotPlayer, helper} = createTurmoilGame();

      // The human holds none anywhere, so T-7.4 ties every party and T-7.5 decides
      turmoil.sendDelegateToParty(marsBotPlayer, PartyName.REDS, game);

      const selected = helper.selectParty();
      expect(selected).is.not.undefined;
      expect(turmoil.getPartyByName(selected!).delegates.get(marsBotPlayer)).to.eq(0);
    });

    it('T-7.6: falls back to the party nearest clockwise from the dominance marker', () => {
      const {game, turmoil, helper} = createTurmoilGame();

      // A NEUTRAL delegate everywhere blocks tiers 1 to 3, and neither player holds any
      // delegates, so tiers 4 and 5 tie every party. That leaves the clockwise tier, which
      // runs towards lower indexes and so picks the party before the dominant one.
      for (const name of Object.values(PartyName)) {
        turmoil.sendDelegateToParty('NEUTRAL', name, game);
      }
      const parties = turmoil.parties;
      const dominantIndex = parties.indexOf(turmoil.dominantParty);
      const expected = parties[(dominantIndex - 1 + parties.length) % parties.length];

      expect(helper.selectParty()).to.equal(expected.name);
    });

    it('returns undefined when MarsBot has no delegates in reserve', () => {
      const {game, turmoil, marsBotPlayer, helper} = createTurmoilGame();

      for (let i = 0; i < DELEGATES_PER_PLAYER; i++) {
        turmoil.sendDelegateToParty(marsBotPlayer, PartyName.MARS, game);
      }
      expect(turmoil.hasDelegatesInReserve(marsBotPlayer)).is.false;

      expect(helper.selectParty()).is.undefined;
    });
  });

  describe('maybePlaceDelegate', () => {
    it('sends a delegate from the reserve to the chosen party', () => {
      const {turmoil, marsBotPlayer, helper} = createTurmoilGame();
      const before = turmoil.getAvailableDelegateCount(marsBotPlayer);

      const partyName = helper.maybePlaceDelegate();

      expect(partyName).is.not.undefined;
      expect(turmoil.getPartyByName(partyName!).delegates.get(marsBotPlayer)).to.eq(1);
      expect(turmoil.getAvailableDelegateCount(marsBotPlayer)).to.eq(before - 1);
    });

    it('takes the party leadership the delegate earns', () => {
      const {game, turmoil, marsBotPlayer, helper} = createTurmoilGame();
      // One NEUTRAL delegate everywhere leaves Greens as the only party where one more MarsBot
      // delegate takes the lead, so that is the party selectParty settles on.
      for (const name of Object.values(PartyName)) {
        turmoil.sendDelegateToParty('NEUTRAL', name, game);
      }
      turmoil.sendDelegateToParty(marsBotPlayer, PartyName.GREENS, game);
      const greens = turmoil.getPartyByName(PartyName.GREENS);
      expect(greens.partyLeader).to.equal('NEUTRAL');

      expect(helper.maybePlaceDelegate()).to.eq(PartyName.GREENS);

      expect(greens.delegates.get(marsBotPlayer)).to.eq(2);
      expect(greens.partyLeader).to.equal(marsBotPlayer);
    });

    it('does nothing when the reserve is empty', () => {
      const {game, turmoil, marsBotPlayer, helper} = createTurmoilGame();
      for (let i = 0; i < DELEGATES_PER_PLAYER; i++) {
        turmoil.sendDelegateToParty(marsBotPlayer, PartyName.MARS, game);
      }
      const placed = turmoil.getPartyByName(PartyName.MARS).delegates.get(marsBotPlayer);

      expect(helper.maybePlaceDelegate()).is.undefined;
      expect(turmoil.getPartyByName(PartyName.MARS).delegates.get(marsBotPlayer)).to.eq(placed);
    });
  });

  // MarsBot is not in game.players, so these exercise checkPartyLeader's path for delegates
  // that are not game players.
  describe('party leadership', () => {
    it('makes MarsBot leader when a sent delegate takes it past the current leader', () => {
      const {game, turmoil, marsBotPlayer} = createTurmoilGame();
      const greens = turmoil.getPartyByName(PartyName.GREENS);
      turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
      turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);

      for (let i = 0; i < 3; i++) {
        turmoil.sendDelegateToParty(marsBotPlayer, PartyName.GREENS, game);
      }

      expect(greens.partyLeader).to.equal(marsBotPlayer);
    });

    it('leaves the leader alone when MarsBot only ties it', () => {
      const {game, turmoil, marsBotPlayer} = createTurmoilGame();
      const greens = turmoil.getPartyByName(PartyName.GREENS);

      for (let i = 0; i < 2; i++) {
        turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
        turmoil.sendDelegateToParty(marsBotPlayer, PartyName.GREENS, game);
      }

      expect(greens.delegates.get(marsBotPlayer)).to.eq(2);
      expect(greens.partyLeader).to.equal('NEUTRAL');
    });

    it('makes MarsBot leader when a removal leaves it with the most delegates', () => {
      const {game, turmoil, marsBotPlayer} = createTurmoilGame();
      const greens = turmoil.getPartyByName(PartyName.GREENS);
      for (let i = 0; i < 3; i++) {
        turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
      }
      turmoil.sendDelegateToParty(marsBotPlayer, PartyName.GREENS, game);
      turmoil.sendDelegateToParty(marsBotPlayer, PartyName.GREENS, game);
      expect(greens.partyLeader).to.equal('NEUTRAL');

      greens.removeDelegate('NEUTRAL', game);
      greens.removeDelegate('NEUTRAL', game);

      expect(greens.delegates.get(marsBotPlayer)).to.eq(2);
      expect(greens.partyLeader).to.equal(marsBotPlayer);
    });
  });
});
