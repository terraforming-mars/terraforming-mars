import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {cast, formatMessage} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {AnOfferYouCantRefuse} from '../../../src/server/cards/moon/AnOfferYouCantRefuse';
import {TestPlayer} from '../../TestPlayer';
import {Delegate, Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {IParty} from '../../../src/server/turmoil/parties/IParty';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {IPlayer} from '../../../src/server/IPlayer';

describe('AnOfferYouCantRefuse', () => {
  let player: TestPlayer;
  let redPlayer: TestPlayer;
  let yellowPlayer: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;
  let parties: Parties;
  let card: AnOfferYouCantRefuse;

  beforeEach(() => {
    [game, player, redPlayer, yellowPlayer] = testGame(3, {moonExpansion: true, turmoilExtension: true});
    turmoil = game.turmoil!;
    parties = new Parties(turmoil);
    clearParties();
    card = new AnOfferYouCantRefuse();
  });

  it('can play fails, all neutral delegates', () => {
    populateParty(parties.unity, 'NEUTRAL');
    expect(card.canPlay(player)).is.false;
  });

  it('can play fails, only active player delegates', () => {
    populateParty(parties.unity, player);
    expect(card.canPlay(player)).is.false;
  });

  it('can play fails, only available player is leader.', () => {
    populateParty(parties.unity, redPlayer);
    expect(parties.unity.partyLeader).eq(redPlayer);
    expect(card.canPlay(player)).is.false;
  });

  it('can play succeeds', () => {
    populateParty(parties.unity, redPlayer, yellowPlayer);
    expect(parties.unity.partyLeader).eq(redPlayer);
    expect(card.canPlay(player)).is.true;
  });

  it('Simple test - cannot exchange', () => {
    assertCannotExchange([redPlayer]);
    assertCannotExchange(['NEUTRAL']);
    assertCannotExchange([redPlayer, player]);
  });

  it('Can exchange - all one party', () => {
    assertExchanges(
      [redPlayer, redPlayer, redPlayer],
      redPlayer,
      [redPlayer]);
  });

  it('Can exchange - green', () => {
    assertExchanges(
      [redPlayer, yellowPlayer],
      redPlayer,
      [yellowPlayer]);
  });

  it('Can exchange - I am party leader', () => {
    assertExchanges(
      [player, yellowPlayer],
      player,
      [yellowPlayer]);
  });

  it('Cannot exchange - I am the party leader and it is just me and neutral', () => {
    assertCannotExchange([player, 'NEUTRAL']);
  });

  it('play', () => {
    populateParty(parties.unity, player, player, redPlayer, redPlayer, yellowPlayer);
    expect(parties.unity.partyLeader).eq(player);
    populateParty(parties.reds, 'NEUTRAL', redPlayer, 'NEUTRAL', redPlayer);
    expect(parties.reds.partyLeader).eq('NEUTRAL');

    expect(card.canPlay(player)).is.true;
    const orOptions = cast(card.play(player), OrOptions);
    assertOptions(
      orOptions,
      [parties.unity, redPlayer],
      [parties.unity, yellowPlayer],
      [parties.reds, redPlayer]);

    // Now do a delegate exchange
    // Swap with Reds / red
    expect(turmoil.getAvailableDelegateCount(player)).eq(7);
    expect(turmoil.getAvailableDelegateCount(redPlayer)).eq(7);
    expectDelegates(parties.reds, 'NEUTRAL', 'NEUTRAL', redPlayer, redPlayer);

    const switchParties = cast(orOptions.options[2].cb(), OrOptions);

    expect(turmoil.getAvailableDelegateCount(player)).eq(6);
    // TODO(kberg): rewrite this test, because it shouldn't be possible for red to have this many delegates.
    expect(turmoil.getAvailableDelegateCount(redPlayer)).eq(8);
    expectDelegates(parties.reds, 'NEUTRAL', 'NEUTRAL', redPlayer, player);

    // Now player may switch parties.
    expect(switchParties.options.map((option) => option.title)).deep.eq(
      [
        'Mars First',
        'Scientists',
        'Unity',
        'Greens',
        'Do not move',
        'Kelvinists',
      ]);

    // This is a repeat assertion from above but it makes the test easier to read.
    expectDelegates(parties.reds, 'NEUTRAL', 'NEUTRAL', redPlayer, player);
    expectDelegates(parties.scientists, ...[]);
    expect(parties.scientists.partyLeader).is.undefined;

    // Choose scientists
    switchParties.options[1].cb();

    expectDelegates(parties.reds, 'NEUTRAL', 'NEUTRAL', redPlayer);
    expectDelegates(parties.scientists, player);
    expect(parties.scientists.partyLeader).eq(player);
  });

  it('play, player chooses not to switch parties', () => {
    populateParty(parties.unity, player, redPlayer, yellowPlayer);
    populateParty(parties.reds, 'NEUTRAL', redPlayer, 'NEUTRAL', redPlayer);

    const options = cast(card.play(player), OrOptions);
    assertOptions(
      options,
      [parties.unity, redPlayer],
      [parties.unity, yellowPlayer],
      [parties.reds, redPlayer]);

    // Now do a delegate exchange
    // Swap with Reds / red
    expectDelegates(parties.reds, 'NEUTRAL', 'NEUTRAL', redPlayer, redPlayer);
    const switchParties = cast(options.options[2].cb(), OrOptions);
    expectDelegates(parties.reds, 'NEUTRAL', 'NEUTRAL', redPlayer, player);

    // Do not move
    switchParties.options[4].cb();

    expectDelegates(parties.reds, 'NEUTRAL', 'NEUTRAL', redPlayer, player);
  });

  function expectDelegates(party: IParty, ...delegates: Array<Delegate>) {
    expect(Array.from(party.delegates.values())).to.have.members(delegates);
  }

  function clearParties() {
    turmoil.parties.forEach((party) => {
      party.delegates.forEachMultiplicity((count, key) => turmoil.delegateReserve.add(key, count));
      party.delegates.clear();
      party.partyLeader = undefined;
    });
  }

  function populateParty(party: IParty, ...delegates: Array<Delegate>) {
    delegates.forEach((delegate) => party.sendDelegate(delegate, game));
  }

  function assertExchanges(delegates: Array<Delegate>, leader: Delegate, expectedOptions: Array<IPlayer>) {
    populateParty(parties.unity, ...delegates);

    expect(parties.unity.partyLeader).eq(leader);
    expect(card.canPlay(player)).is.true;

    const options = cast(card.play(player), OrOptions);
    const mapped: Array<[IParty, IPlayer]> = expectedOptions.map((player) => [parties.unity, player]);
    assertOptions(options, ...mapped);
  }

  function assertOptions(orOptions: OrOptions, ...expectedOptions: Array<[IParty, IPlayer]>) {
    const expectedStrings = expectedOptions.map((entry) => `${entry[0].name} / ${entry[1].color}`);
    const actualStrings = orOptions.options.map((option) => formatMessage(option.title));
    expect(actualStrings).deep.eq(expectedStrings);
  }

  function assertCannotExchange(delegates: Array<Delegate>) {
    populateParty(parties.unity, ...delegates);
    expect(card.canPlay(player)).is.false;
  }
});

class Parties {
  public greens: IParty;
  public reds: IParty;
  public scientists: IParty;
  public unity: IParty;
  public kelvinists: IParty;
  public marsFirst: IParty;
  constructor(public turmoil: Turmoil) {
    this.greens = turmoil.getPartyByName(PartyName.GREENS);
    this.reds = turmoil.getPartyByName(PartyName.REDS);
    this.scientists = turmoil.getPartyByName(PartyName.SCIENTISTS);
    this.unity = turmoil.getPartyByName(PartyName.UNITY);
    this.kelvinists = turmoil.getPartyByName(PartyName.KELVINISTS);
    this.marsFirst = turmoil.getPartyByName(PartyName.MARS);
  }
}
