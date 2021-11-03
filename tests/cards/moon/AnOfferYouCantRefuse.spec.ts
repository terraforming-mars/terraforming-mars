import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {AnOfferYouCantRefuse} from '../../../src/cards/moon/AnOfferYouCantRefuse';
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {NeutralPlayer, Turmoil} from '../../../src/turmoil/Turmoil';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {PlayerId} from '../../../src/Player';
import {IParty} from '../../../src/turmoil/parties/IParty';
import {OrOptions} from '../../../src/inputs/OrOptions';

const GAME_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true, turmoilExtension: true});

describe('AnOfferYouCantRefuse', () => {
  let player: TestPlayer;
  let redPlayer: TestPlayer;
  let greenPlayer: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;
  let parties: Parties;
  let card: AnOfferYouCantRefuse;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    redPlayer = TestPlayers.RED.newPlayer();
    greenPlayer = TestPlayers.GREEN.newPlayer();
    game = Game.newInstance('id', [player, redPlayer, greenPlayer], player, GAME_OPTIONS);
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

    const options = card.play(player);
    expect(options.options.map((option) => option.title)).deep.eq(
      [
        'Greens / player-red', // Option 0
        'Greens / player-green', // Option 1
        'Reds / player-red', // Option 2
      ]);

    // Now do a delegate exchange
    // Swap with Reds / red
    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(6);
    expect(turmoil.getAvailableDelegateCount(redPlayer.id, 'reserve')).eq(6);
    expect(parties.reds.delegates).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id, redPlayer.id]);

    const switchParties = options.options[2].cb() as OrOptions;

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(5);
    expect(turmoil.getAvailableDelegateCount(redPlayer.id, 'reserve')).eq(7);
    expect(parties.reds.delegates).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id, player.id]);

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
    expect(parties.reds.delegates).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id, player.id]);
    expect(parties.scientists.delegates).to.have.members([]);
    expect(parties.scientists.partyLeader).is.undefined;

    // Choose scientists
    switchParties.options[1].cb();

    expect(parties.reds.delegates).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id]);
    expect(parties.scientists.delegates).to.have.members([player.id]);
    expect(parties.scientists.partyLeader).eq(player.id);
  });

  it('play, player chooses not to switch parties', () => {
    populateParty(parties.greens, player.id, redPlayer.id, greenPlayer.id);
    populateParty(parties.reds, 'NEUTRAL', redPlayer.id, 'NEUTRAL', redPlayer.id);

    const options = card.play(player);
    expect(options.options.map((option) => option.title)).deep.eq(
      [
        'Greens / player-red', // Option 0
        'Greens / player-green', // Option 1
        'Reds / player-red', // Option 2
      ]);

    // Now do a delegate exchange
    // Swap with Reds / red
    expect(parties.reds.delegates).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id, redPlayer.id]);
    const switchParties = options.options[2].cb() as OrOptions;
    expect(parties.reds.delegates).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id, player.id]);

    // Do not move
    switchParties.options[4].cb();

    expect(parties.reds.delegates).to.have.members(['NEUTRAL', 'NEUTRAL', redPlayer.id, player.id]);
  });

  it('play can change leadership twice', () => {
    populateParty(parties.greens, redPlayer.id, greenPlayer.id, player.id);
    expect(parties.greens.partyLeader).eq(redPlayer.id);
    populateParty(parties.reds, 'NEUTRAL', player.id);
    expect(parties.reds.partyLeader).eq('NEUTRAL');

    const options = card.play(player);
    expect(options.options.map((option) => option.title)).deep.eq(['Greens / player-green']);

    // Now do a delegate exchange
    // Swap with Greens / green
    const switchParties = options.options[0].cb() as OrOptions;

    expect(parties.greens.delegates).to.have.members([redPlayer.id, player.id, player.id]);
    expect(parties.greens.partyLeader).to.eq(player.id);

    // Now choose reds (option 4).
    switchParties.options[4].cb();

    expect(parties.greens.delegates).to.have.members([redPlayer.id, player.id]);
    expect(parties.greens.partyLeader).to.eq(player.id);
    expect(parties.reds.delegates).to.have.members([player.id, player.id, 'NEUTRAL']);
    expect(parties.reds.partyLeader).to.eq(player.id);
  });

  function clearParties() {
    turmoil.parties.forEach((party) => {
      turmoil.delegateReserve.push(...party.delegates.filter((delegate) => delegate !== 'NEUTRAL'));
      party.delegates = [];
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
