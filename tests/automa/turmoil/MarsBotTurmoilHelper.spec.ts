import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {DELEGATES_PER_PLAYER} from '@/common/constants';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {PartyName} from '@/common/turmoil/PartyName';
import {MarsBotTurmoilHelper} from '@/server/automa/turmoil/MarsBotTurmoilHelper';
import {IGame} from '@/server/IGame';
import {IPlayer} from '@/server/IPlayer';
import {TestPlayer} from '../../TestPlayer';
import {IParty} from '@/server/turmoil/parties/IParty';
import {Capital} from '@/server/cards/base/Capital';

describe('MarsBotTurmoilHelper', () => {
  let game: IGame;
  let human: TestPlayer;
  let marsBot: IPlayer;
  let turmoil: Turmoil;
  let helper: MarsBotTurmoilHelper;

  beforeEach(() => {
    // Setup also puts a NEUTRAL delegate in Mars First, which is dominant, and in Scientists.
    [game, human] = testGame(1, {automa: true, turmoilExtension: true});
    marsBot = game.marsBotPlayer!;
    turmoil = Turmoil.getTurmoil(game);
    helper = new MarsBotTurmoilHelper(game);
  });

  // The numbered priority list on Party Politics, rulebook C p.6.
  it('priority 1: picks a party where one more delegate makes MarsBot leader and the party dominant', () => {
    for (const name of [PartyName.MARS, PartyName.UNITY, PartyName.REDS, PartyName.GREENS]) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
    }
    turmoil.sendDelegateToParty(marsBot, PartyName.SCIENTISTS, game);

    expect(helper.selectParty()).eq(PartyName.SCIENTISTS);
  });

  it('priority 2: picks a party where one more delegate makes MarsBot leader', () => {
    for (let i = 0; i < 5; i++) {
      turmoil.sendDelegateToParty('NEUTRAL', PartyName.KELVINISTS, game);
    }
    turmoil.sendDelegateToParty(marsBot, PartyName.SCIENTISTS, game);
    for (const name of [PartyName.MARS, PartyName.UNITY, PartyName.REDS, PartyName.GREENS]) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
    }

    expect(helper.selectParty()).eq(PartyName.SCIENTISTS);
  });

  it('priority 3: picks a party MarsBot leads where one more delegate makes it dominant', () => {
    for (const name of [PartyName.MARS, PartyName.SCIENTISTS, PartyName.KELVINISTS, PartyName.REDS, PartyName.GREENS]) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
    }
    turmoil.sendDelegateToParty(marsBot, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(marsBot, PartyName.UNITY, game);

    expect(helper.selectParty()).eq(PartyName.UNITY);
  });

  it('priority 3: skips a party that is already dominant', () => {
    for (const name of Object.values(PartyName)) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
    }
    for (let i = 0; i < 3; i++) {
      turmoil.sendDelegateToParty(marsBot, PartyName.UNITY, game);
    }

    expect(helper.selectParty()).not.eq(PartyName.UNITY);
  });

  it('priority 4: picks the party where the human has the fewest delegates', () => {
    for (const name of Object.values(PartyName)) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
    }
    for (const name of [PartyName.MARS, PartyName.SCIENTISTS, PartyName.UNITY, PartyName.KELVINISTS, PartyName.REDS]) {
      turmoil.sendDelegateToParty(human, name, game);
    }

    expect(helper.selectParty()).eq(PartyName.GREENS);
  });

  it('priority 5: picks the party where MarsBot has the fewest delegates', () => {
    // Two NEUTRAL delegates where MarsBot has one, so one more MarsBot delegate never takes a lead.
    for (const name of Object.values(PartyName)) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
      if (name !== PartyName.GREENS) {
        turmoil.sendDelegateToParty('NEUTRAL', name, game);
        turmoil.sendDelegateToParty(marsBot, name, game);
      }
    }

    expect(helper.selectParty()).eq(PartyName.GREENS);
  });

  it('priority 6: picks the next party clockwise from the dominance marker', () => {
    for (const name of Object.values(PartyName)) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
    }

    expect(helper.selectParty()).eq(PartyName.KELVINISTS);
  });

  it('takes the party lead the delegate earns', () => {
    for (const name of Object.values(PartyName)) {
      turmoil.sendDelegateToParty('NEUTRAL', name, game);
    }
    turmoil.sendDelegateToParty(marsBot, PartyName.GREENS, game);
    const greens = turmoil.getPartyByName(PartyName.GREENS);

    expect(helper.maybePlaceDelegate()).eq(PartyName.GREENS);

    expect(greens.partyLeader).eq(marsBot);
  });

  it('does nothing when the reserve is empty', () => {
    for (let i = 0; i < DELEGATES_PER_PLAYER; i++) {
      turmoil.sendDelegateToParty(marsBot, PartyName.MARS, game);
    }

    expect(helper.maybePlaceDelegate()).is.undefined;
  });

  it('returns undefined when MarsBot has no delegates in reserve', () => {
    for (let i = 0; i < DELEGATES_PER_PLAYER; i++) {
      turmoil.sendDelegateToParty(marsBot, PartyName.MARS, game);
    }

    expect(helper.selectParty()).is.undefined;
  });

  it('sends a delegate from the reserve to the chosen party', () => {
    const before = turmoil.delegateReserve.get(marsBot);

    const partyName = helper.maybePlaceDelegate();

    expect(partyName).is.not.undefined;
    expect(turmoil.getPartyByName(partyName!).delegates.get(marsBot)).eq(1);
    expect(turmoil.delegateReserve.get(marsBot)).eq(before - 1);
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
        turmoil.sendDelegateToParty(marsBot, PartyName.GREENS, game);
      }

      expect(greens.partyLeader).eq(marsBot);
    });

    it('leaves the leader alone when MarsBot only ties it', () => {
      for (let i = 0; i < 2; i++) {
        turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
        turmoil.sendDelegateToParty(marsBot, PartyName.GREENS, game);
      }

      expect(greens.delegates.get(marsBot)).eq(2);
      expect(greens.partyLeader).eq('NEUTRAL');
    });

    it('makes MarsBot leader when a removal leaves it with the most delegates', () => {
      for (let i = 0; i < 3; i++) {
        turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
      }
      turmoil.sendDelegateToParty(marsBot, PartyName.GREENS, game);
      turmoil.sendDelegateToParty(marsBot, PartyName.GREENS, game);
      expect(greens.partyLeader).eq('NEUTRAL');

      greens.removeDelegate('NEUTRAL', game);
      greens.removeDelegate('NEUTRAL', game);

      expect(greens.delegates.get(marsBot)).eq(2);
      expect(greens.partyLeader).eq(marsBot);
    });
  });

  // The priority list on Gray Eminence (Septem Tribus): fewest MarsBot delegates, then fewest of the
  // player's, then a random party picked by flipping a project card.
  describe('selectGrayEminenceParty', () => {
    it('picks the party with the fewest MarsBot delegates over the one with the fewest human delegates', () => {
      for (const name of Object.values(PartyName)) {
        if (name !== PartyName.GREENS) {
          turmoil.sendDelegateToParty(marsBot, name, game);
        }
      }
      turmoil.sendDelegateToParty(human, PartyName.GREENS, game);
      turmoil.sendDelegateToParty(human, PartyName.GREENS, game);

      expect(helper.selectGrayEminenceParty()).eq(PartyName.GREENS);
    });

    it('breaks a tie on MarsBot delegates with the fewest human delegates, without flipping a card', () => {
      for (const name of [PartyName.MARS, PartyName.SCIENTISTS]) {
        turmoil.sendDelegateToParty(marsBot, name, game);
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
        turmoil.sendDelegateToParty(marsBot, name, game);
      }
      game.projectDeck.drawPile.push(new Capital());

      // Greens, Reds and Kelvinists are tied and (26 - 1) % 3 = 1 picks the second, Reds.
      expect(helper.selectGrayEminenceParty()).eq(PartyName.REDS);
    });
  });
});
