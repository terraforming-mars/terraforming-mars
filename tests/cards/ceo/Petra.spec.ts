import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {IParty} from '../../../src/server/turmoil/parties/IParty';
import {testGame} from '../../TestGame';
import {Petra} from '../../../src/server/cards/ceos/Petra';
import {TPolitician} from '../../../src/server/awards/terraCimmeria/TPolitician';

describe('Petra', () => {
  let card: Petra;
  let player: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;
  let mars: IParty;
  let unity: IParty;
  let greens: IParty;
  let scientists: IParty;
  let reds: IParty;
  let kelvinists: IParty;

  beforeEach(() => {
    card = new Petra();
    [game, player] = testGame(2, {ceoExtension: true, turmoilExtension: true});

    turmoil = game.turmoil!;
    scientists = turmoil.getPartyByName(PartyName.SCIENTISTS)!;
    greens = turmoil.getPartyByName(PartyName.GREENS)!;
    reds = turmoil.getPartyByName(PartyName.REDS)!;
    unity = turmoil.getPartyByName(PartyName.UNITY)!;
    mars = turmoil.getPartyByName(PartyName.MARS)!;
    kelvinists = turmoil.getPartyByName(PartyName.KELVINISTS)!;

    // Manually set up 5 neutral delegates (4 in parties + chairman)
    turmoil.parties.forEach((party) => {
      party.delegates.forEachMultiplicity((count, key) => turmoil.delegateReserve.add(key, count));
      party.delegates.clear();
      party.partyLeader = undefined;
    });

    turmoil.chairman = 'NEUTRAL';
    turmoil.sendDelegateToParty('NEUTRAL', scientists.name, game);
    turmoil.sendDelegateToParty('NEUTRAL', scientists.name, game);
    turmoil.sendDelegateToParty('NEUTRAL', greens.name, game);
    turmoil.sendDelegateToParty('NEUTRAL', reds.name, game);
  });

  it('Initial sanity check', () => {
    expect(unity.delegates.count('NEUTRAL')).eq(0);
    expect(mars.delegates.count('NEUTRAL')).eq(0);
    expect(kelvinists.delegates.count('NEUTRAL')).eq(0);

    expect(turmoil.chairman).eq('NEUTRAL');
    expect(scientists.delegates.count('NEUTRAL')).eq(2);
    expect(scientists.partyLeader).eq('NEUTRAL');
    expect(greens.delegates.count('NEUTRAL')).eq(1);
    expect(greens.partyLeader).eq('NEUTRAL');
    expect(reds.delegates.count('NEUTRAL')).eq(1);
  });

  it('Can act', () => {
    expect(card.canAct(player)).is.true;
  });

  it('Cannot act if there are too many neutral delegates', () => {
    // There are 5 neuts already, send 3 more to total 8.  Players only have 7 delegates.
    turmoil.sendDelegateToParty('NEUTRAL', reds.name, game);
    turmoil.sendDelegateToParty('NEUTRAL', reds.name, game);
    turmoil.sendDelegateToParty('NEUTRAL', reds.name, game);
    expect(card.canAct(player)).is.false;
  });

  it('Takes OPG action - lobby delegate remains unused', () => {
    // Replace 4 delegates + chairman
    card.action(player);

    expect(scientists.delegates.count(player)).eq(2);
    expect(scientists.partyLeader).eq(player);

    expect(greens.delegates.count(player)).eq(1);
    expect(greens.partyLeader).eq(player);

    expect(reds.delegates.count(player)).eq(1);
    expect(reds.partyLeader).eq(player);

    expect(player.megaCredits).to.eq(15);

    // Make sure that the player has the correct amount of spare delegates
    expect(turmoil.getAvailableDelegateCount(player)).eq(2); // 1 Reserve + 1 Lobby
    expect(turmoil.delegateReserve.has(player)).is.true;
    expect(turmoil.chairman).eq(player);


    // Send 3 Neutral delegates
    // This creates at least 3 deferredActions, with possible extra deferredActions for logging
    expect(game.deferredActions.length).is.greaterThanOrEqual(3);

    while (game.deferredActions.length) {
      const selectParty = game.deferredActions.pop()!.execute() as SelectParty;
      if (selectParty !== undefined) {
        selectParty.cb(PartyName.GREENS);
      }
    }

    expect(greens.delegates.count('NEUTRAL')).eq(3);
  });

  it('Takes OPG action - all 7 delegates used (including lobby)', () => {
    // Add two more neut delegates to Scientists, now 6 + 1 neut chairman (7 neut total)
    turmoil.sendDelegateToParty('NEUTRAL', scientists.name, game);
    turmoil.sendDelegateToParty('NEUTRAL', scientists.name, game);

    // Replace 6 delegates + chairman
    card.action(player);
    expect(turmoil.getAvailableDelegateCount(player)).eq(0);
    expect(turmoil.delegateReserve.has(player)).is.false;
    expect(turmoil.chairman).eq(player);

    expect(scientists.delegates.count(player)).eq(4);
    expect(scientists.partyLeader).eq(player);

    expect(greens.delegates.count(player)).eq(1);
    expect(greens.partyLeader).eq(player);

    expect(reds.delegates.count(player)).eq(1);
    expect(reds.partyLeader).eq(player);

    // We should have been paid 3MC for every swap, 7*3 total
    expect(player.megaCredits).to.eq(21);
  });


  it('OPG Counts for POLITICAN Award', () => {
    const politician = new TPolitician();
    game.awards = [];
    game.awards.push(politician);
    const preOPGScore = game.awards[0].getScore(player);
    card.action(player);
    runAllActions(game);
    expect(game.awards[0].getScore(player)).eq(preOPGScore+5); // 1 Chairman, 4 Delegates
  });


  it('Can only act once per game', () => {
    card.action(player);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
