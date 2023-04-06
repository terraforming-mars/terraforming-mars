import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {cast, formatMessage, testGameOptions} from '../../TestingUtils';
import {AnOfferYouCantRefuse} from '../../../src/server/cards/moon/AnOfferYouCantRefuse';
import {TestPlayer} from '../../TestPlayer';
import {NeutralPlayer, Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {PlayerId} from '../../../src/common/Types';
import {IParty} from '../../../src/server/turmoil/parties/IParty';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('AnOfferYouCantRefuse', () => {
  let player: TestPlayer;
  let redPlayer: TestPlayer;
  let greenPlayer: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;
  let parties: Parties;
  let card: AnOfferYouCantRefuse;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    redPlayer = TestPlayer.RED.newPlayer();
    greenPlayer = TestPlayer.GREEN.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer, greenPlayer], player, testGameOptions({moonExpansion: true, turmoilExtension: true}));
    turmoil = game.turmoil!;
    parties = new Parties(turmoil);
    clearParties();
    card = new AnOfferYouCantRefuse();
  });

  it('can play fails, all neutral delegates', () => {
    populateParty(parties.greens, 'NEUTRAL');
    expect(card.canPlay(player)).is.false;
  });

  it('can play fails, only active player delegates', () => {
    populateParty(parties.greens, player.id);
    expect(card.canPlay(player)).is.false;
  });

  it('can play fails, only available player is leader.', () => {
    populateParty(parties.greens, redPlayer.id);
    expect(parties.greens.partyLeader).eq(redPlayer.id);
    expect(card.canPlay(player)).is.false;
  });

  it('can play succeeds', () => {
    populateParty(parties.greens, redPlayer.id, greenPlayer.id);
    expect(parties.greens.partyLeader).eq(redPlayer.id);
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    populateParty(parties.greens, player.id, redPlayer.id, greenPlayer.id);
    expect(parties.greens.partyLeader).eq(player.id);
    populateParty(parties.reds, 'NEUTRAL', redPlayer.id, 'NEUTRAL', redPlayer.id);
    expect(parties.reds.partyLeader).eq('NEUTRAL');

    expect(card.canPlay(player)).is.true;
    const options = cast(card.play(player), OrOptions);
    const strings = options.options.map((option) => formatMessage(option.title));
    expect(strings).deep.eq(
      [
        'Greens / p-red-id', // Option 0
        'Greens / p-green-id', // Option 1
        'Reds / p-red-id', // Option 2
      ]);

    // Now do a delegate exchange
    // Swap with Reds / red
    expect(turmoil.getAvailableDelegateCount(player.id)).eq(7);
    expect(turmoil.getAvailableDelegateCount(redPlayer.id)).eq(7);
    expect(Array.from(parties.reds.delegates.values())).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id, redPlayer.id]);

    const switchParties = cast(options.options[2].cb(), OrOptions);

    expect(turmoil.getAvailableDelegateCount(player.id)).eq(6);
    // TODO(kberg): rewrite this test, because it shouldn't be possible for red to have this many delegates.
    expect(turmoil.getAvailableDelegateCount(redPlayer.id)).eq(8);
    expect(Array.from(parties.reds.delegates.values())).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id, player.id]);

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
    expect(Array.from(parties.reds.delegates.values())).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id, player.id]);
    expect(Array.from(parties.scientists.delegates.values())).to.have.members([]);
    expect(parties.scientists.partyLeader).is.undefined;

    // Choose scientists
    switchParties.options[1].cb();

    expect(Array.from(parties.reds.delegates.values())).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id]);
    expect(Array.from(parties.scientists.delegates.values())).to.have.members([player.id]);
    expect(parties.scientists.partyLeader).eq(player.id);
  });

  it('play, player chooses not to switch parties', () => {
    populateParty(parties.greens, player.id, redPlayer.id, greenPlayer.id);
    populateParty(parties.reds, 'NEUTRAL', redPlayer.id, 'NEUTRAL', redPlayer.id);

    const options = cast(card.play(player), OrOptions);
    const strings = options.options.map((option) => formatMessage(option.title));
    expect(strings).deep.eq(
      [
        'Greens / p-red-id', // Option 0
        'Greens / p-green-id', // Option 1
        'Reds / p-red-id', // Option 2
      ]);

    // Now do a delegate exchange
    // Swap with Reds / red
    expect(Array.from(parties.reds.delegates.values())).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id, redPlayer.id]);
    const switchParties = cast(options.options[2].cb(), OrOptions);
    expect(Array.from(parties.reds.delegates.values())).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id, player.id]);

    // Do not move
    switchParties.options[4].cb();

    expect(Array.from(parties.reds.delegates.values())).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id, player.id]);
  });

  it('play can change leadership twice', () => {
    populateParty(parties.greens, redPlayer.id, greenPlayer.id, player.id);
    expect(parties.greens.partyLeader).eq(redPlayer.id);
    populateParty(parties.reds, 'NEUTRAL', player.id);
    expect(parties.reds.partyLeader).eq('NEUTRAL');

    const options = cast(card.play(player), OrOptions);
    const strings = options.options.map((option) => formatMessage(option.title));
    expect(strings).deep.eq(['Greens / p-green-id']);

    // Now do a delegate exchange
    // Swap with Greens / green
    const switchParties = cast(options.options[0].cb(), OrOptions);

    expect(Array.from(parties.greens.delegates.values())).to.have.members([redPlayer.id, player.id, player.id]);
    expect(parties.greens.partyLeader).to.eq(player.id);

    // Now choose reds (option 4).
    switchParties.options[4].cb();

    expect(Array.from(parties.greens.delegates.values())).to.have.members([redPlayer.id, player.id]);
    expect(parties.greens.partyLeader).to.eq(player.id);
    expect(Array.from(parties.reds.delegates.values())).to.have.members([player.id, player.id, 'NEUTRAL']);
    expect(parties.reds.partyLeader).to.eq(player.id);
  });

  function clearParties() {
    turmoil.parties.forEach((party) => {
      party.delegates.forEachMultiplicity((count, key) => turmoil.delegateReserve.add(key, count));
      party.delegates.clear();
      party.partyLeader = undefined;
    });
  }

  function populateParty(party: IParty, ...delegates: Array<PlayerId | NeutralPlayer>) {
    delegates.forEach((delegate) => party.sendDelegate(delegate, game));
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
