import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {DELEGATES_PER_PLAYER} from '@/common/constants';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {PartyName} from '@/common/turmoil/PartyName';
import {MarsBotTurmoilHelper} from '@/server/automa/turmoil/MarsBotTurmoilHelper';
import {IGame} from '@/server/IGame';
import {IPlayer} from '@/server/IPlayer';
import {TestPlayer} from '../../TestPlayer';

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
});
