import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {DELEGATES_PER_PLAYER} from '@/common/constants';
import {Delegate, Turmoil} from '@/server/turmoil/Turmoil';
import {PartyName} from '@/common/turmoil/PartyName';
import {MarsBotTurmoilHelper} from '@/server/automa/turmoil/MarsBotTurmoilHelper';
import {IGame} from '@/server/IGame';
import {IPlayer} from '@/server/IPlayer';
import {TestPlayer} from '../../TestPlayer';
import {IParty} from '@/server/turmoil/parties/IParty';
import {Capital} from '@/server/cards/base/Capital';

const ALL_PARTIES = Object.values(PartyName);

/** Every party but the ones named. */
function partiesExcept(...names: Array<PartyName>): Array<PartyName> {
  return ALL_PARTIES.filter((name) => !names.includes(name));
}

describe('MarsBotTurmoilHelper', () => {
  let game: IGame;
  let human: TestPlayer;
  let botPlayer: IPlayer;
  let turmoil: Turmoil;
  let helper: MarsBotTurmoilHelper;

  beforeEach(() => {
    // Setup also puts a NEUTRAL delegate in Mars First, which is dominant, and in Scientists.
    [game, human] = testGame(1, {automa: true, turmoilExtension: true});
    botPlayer = game.marsBotPlayer!;
    turmoil = Turmoil.getTurmoil(game);
    helper = new MarsBotTurmoilHelper(game);
  });

  function sendDelegates(delegate: Delegate, parties: ReadonlyArray<PartyName>) {
    for (const name of parties) {
      turmoil.sendDelegateToParty(delegate, name, game);
    }
  }

  // The numbered priority list on Party Politics, rulebook C p.6.
  it('priority 1: picks a party where one more delegate makes MarsBot leader and the party dominant', () => {
    sendDelegates('NEUTRAL', partiesExcept(PartyName.SCIENTISTS, PartyName.KELVINISTS));
    turmoil.sendDelegateToParty(botPlayer, PartyName.SCIENTISTS, game);

    expect(helper.selectParty()).eq(PartyName.SCIENTISTS);
  });

  it('priority 2: picks a party where one more delegate makes MarsBot leader', () => {
    for (let i = 0; i < 5; i++) {
      turmoil.sendDelegateToParty('NEUTRAL', PartyName.KELVINISTS, game);
    }
    turmoil.sendDelegateToParty(botPlayer, PartyName.SCIENTISTS, game);
    sendDelegates('NEUTRAL', partiesExcept(PartyName.SCIENTISTS, PartyName.KELVINISTS));

    expect(helper.selectParty()).eq(PartyName.SCIENTISTS);
  });

  it('priority 3: picks a party MarsBot leads where one more delegate makes it dominant', () => {
    sendDelegates('NEUTRAL', partiesExcept(PartyName.UNITY));
    turmoil.sendDelegateToParty(botPlayer, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(botPlayer, PartyName.UNITY, game);

    expect(helper.selectParty()).eq(PartyName.UNITY);
  });

  it('priority 3: skips a party that is already dominant', () => {
    sendDelegates('NEUTRAL', ALL_PARTIES);
    for (let i = 0; i < 3; i++) {
      turmoil.sendDelegateToParty(botPlayer, PartyName.UNITY, game);
    }
    expect(turmoil.dominantParty.name).eq(PartyName.UNITY);

    // No other priority applies, so it's the next party clockwise from Unity.
    expect(helper.selectParty()).eq(PartyName.SCIENTISTS);
  });

  it('priority 4: picks the party where the human has the fewest delegates', () => {
    sendDelegates('NEUTRAL', ALL_PARTIES);
    sendDelegates(human, partiesExcept(PartyName.GREENS));

    expect(helper.selectParty()).eq(PartyName.GREENS);
  });

  it('priority 5: picks the party where MarsBot has the fewest delegates', () => {
    // Two NEUTRAL delegates where MarsBot has one, so one more MarsBot delegate never takes a lead.
    for (const name of ALL_PARTIES) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
      if (name !== PartyName.GREENS) {
        turmoil.sendDelegateToParty('NEUTRAL', name, game);
        turmoil.sendDelegateToParty(botPlayer, name, game);
      }
    }

    expect(helper.selectParty()).eq(PartyName.GREENS);
  });

  it('priority 6: picks the next party clockwise from the dominance marker', () => {
    sendDelegates('NEUTRAL', ALL_PARTIES);

    expect(helper.selectParty()).eq(PartyName.KELVINISTS);
  });

  it('takes the party lead the delegate earns', () => {
    sendDelegates('NEUTRAL', ALL_PARTIES);
    turmoil.sendDelegateToParty(botPlayer, PartyName.GREENS, game);
    const greens = turmoil.getPartyByName(PartyName.GREENS);

    expect(helper.maybePlaceDelegate()).eq(PartyName.GREENS);

    expect(greens.partyLeader).eq(botPlayer);
  });

  it('does nothing when the reserve is empty', () => {
    for (let i = 0; i < DELEGATES_PER_PLAYER; i++) {
      turmoil.sendDelegateToParty(botPlayer, PartyName.MARS, game);
    }

    expect(helper.maybePlaceDelegate()).is.undefined;
  });

  it('returns undefined when MarsBot has no delegates in reserve', () => {
    for (let i = 0; i < DELEGATES_PER_PLAYER; i++) {
      turmoil.sendDelegateToParty(botPlayer, PartyName.MARS, game);
    }

    expect(helper.selectParty()).is.undefined;
  });

  it('sends a delegate from the reserve to the party it picks', () => {
    const before = turmoil.delegateReserve.get(botPlayer);

    // MarsBot would lead any empty party (priority 2), and Kelvinists is the first of those clockwise from Mars First.
    expect(helper.maybePlaceDelegate()).eq(PartyName.KELVINISTS);

    expect(turmoil.getPartyByName(PartyName.KELVINISTS).delegates.get(botPlayer)).eq(1);
    expect(turmoil.delegateReserve.get(botPlayer)).eq(before - 1);
  });

  // MarsBot is not in game.players, so these exercise checkPartyLeader's path for delegates
  // that are not game players.
  describe('party leadership', () => {
    let greens: IParty;

    beforeEach(() => {
      greens = turmoil.getPartyByName(PartyName.GREENS);
    });

    it('makes MarsBot leader when a sent delegate takes it past the current leader', () => {
      turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
      turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);

      for (let i = 0; i < 3; i++) {
        turmoil.sendDelegateToParty(botPlayer, PartyName.GREENS, game);
      }

      expect(greens.partyLeader).eq(botPlayer);
    });

    it('leaves the leader alone when MarsBot only ties it', () => {
      for (let i = 0; i < 2; i++) {
        turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
        turmoil.sendDelegateToParty(botPlayer, PartyName.GREENS, game);
      }

      expect(greens.delegates.get(botPlayer)).eq(2);
      expect(greens.partyLeader).eq('NEUTRAL');
    });

    it('makes MarsBot leader when a removal leaves it with the most delegates', () => {
      for (let i = 0; i < 3; i++) {
        turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
      }
      turmoil.sendDelegateToParty(botPlayer, PartyName.GREENS, game);
      turmoil.sendDelegateToParty(botPlayer, PartyName.GREENS, game);
      expect(greens.partyLeader).eq('NEUTRAL');

      greens.removeDelegate('NEUTRAL', game);
      greens.removeDelegate('NEUTRAL', game);

      expect(greens.delegates.get(botPlayer)).eq(2);
      expect(greens.partyLeader).eq(botPlayer);
    });
  });

  // The priority list on Gray Eminence (Septem Tribus): fewest MarsBot delegates, then fewest of the
  // player's, then a random party picked by flipping a project card.
  describe('selectGrayEminenceParty', () => {
    it('picks the party with the fewest MarsBot delegates over the one with the fewest human delegates', () => {
      sendDelegates(botPlayer, partiesExcept(PartyName.GREENS));
      turmoil.sendDelegateToParty(human, PartyName.GREENS, game);
      turmoil.sendDelegateToParty(human, PartyName.GREENS, game);

      expect(helper.selectGrayEminenceParty()).eq(PartyName.GREENS);
    });

    it('breaks a tie on MarsBot delegates with the fewest human delegates, without flipping a card', () => {
      for (const name of [PartyName.MARS, PartyName.SCIENTISTS]) {
        turmoil.sendDelegateToParty(botPlayer, name, game);
      }
      for (const name of [PartyName.UNITY, PartyName.REDS, PartyName.KELVINISTS]) {
        turmoil.sendDelegateToParty(human, name, game);
      }
      const discarded = game.projectDeck.discardPile.length;

      expect(helper.selectGrayEminenceParty()).eq(PartyName.GREENS);
      expect(game.projectDeck.discardPile.length).eq(discarded);
    });

    it('breaks a full tie by the cost of a flipped project card', () => {
      game.projectDeck.drawPile.push(new Capital());
      const discarded = game.projectDeck.discardPile.length;

      // Capital costs 26, so (26 - 1) % 6 = 1 picks the second party, Scientists.
      expect(helper.selectGrayEminenceParty()).eq(PartyName.SCIENTISTS);
      expect(game.projectDeck.discardPile.length).eq(discarded + 1);
    });

    it('counts the flipped card through only the parties that are still tied', () => {
      for (const name of [PartyName.MARS, PartyName.SCIENTISTS, PartyName.UNITY]) {
        turmoil.sendDelegateToParty(botPlayer, name, game);
      }
      game.projectDeck.drawPile.push(new Capital());

      // Greens, Reds and Kelvinists are tied and (26 - 1) % 3 = 1 picks the second, Reds.
      expect(helper.selectGrayEminenceParty()).eq(PartyName.REDS);
    });
  });
});
