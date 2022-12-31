import {expect} from "chai";
import {Game} from "../../../src/server/Game";
import {SelectPartyToSendDelegate} from '../../../src/server/inputs/SelectPartyToSendDelegate';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from "../../../src/server/turmoil/Turmoil";
import {forceGenerationEnd} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';
import {testGameOptions} from '../../TestingUtils';
import {IParty} from '../../../src/server/turmoil/parties/IParty';

import {Petra} from "../../../src/server/cards/leaders/Petra";


describe('Petra', function() {
  let card: Petra;
  let player: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;
  let reds: IParty;
  let scientists: IParty;
  let greens: IParty;
  
  beforeEach(function() {
    card = new Petra();
    player = TestPlayer.BLUE.newPlayer();

    game = Game.newInstance('gameid', [player], player, testGameOptions({turmoilExtension: true}));
    turmoil = game.turmoil!;
    reds = turmoil.getPartyByName(PartyName.REDS)!;
    scientists = turmoil.getPartyByName(PartyName.SCIENTISTS)!;
    greens = turmoil.getPartyByName(PartyName.GREENS)!;

    // Manually set up 5 neutral delegates (4 in parties + chairman)
    turmoil.chairman = "NEUTRAL";
    turmoil.sendDelegateToParty("NEUTRAL", scientists.name, game);
    turmoil.sendDelegateToParty("NEUTRAL", scientists.name, game);
    turmoil.sendDelegateToParty("NEUTRAL", greens.name, game);
    turmoil.sendDelegateToParty("NEUTRAL", reds.name, game);
  });

  it('Can act', function() {
    expect(card.canAct(player)).is.true;
  });

  it('Cannot act if there are too many neutral delegates', function() {
    // There are 5 neuts already, send 3 more to total 8.  Players only have 7 delegates.
    turmoil.sendDelegateToParty("NEUTRAL", reds.name, game);
    turmoil.sendDelegateToParty("NEUTRAL", reds.name, game);
    turmoil.sendDelegateToParty("NEUTRAL", reds.name, game);
    expect(card.canAct(player)).is.false;
  });

  it('Takes OPG action - lobby delegate remains unused', function() {
    // Replace 4 delegates + chairman
    card.action(player);

    expect(scientists.delegates.count(player.id)).eq(2);
    expect(scientists.partyLeader).eq(player.id);

    expect(greens.delegates.count(player.id)).eq(1);
    expect(greens.partyLeader).eq(player.id);

    expect(reds.delegates.count(player.id)).eq(1);
    expect(reds.partyLeader).eq(player.id);

    expect(player.megaCredits).to.eq(15);

    // Make sure that the player has the correct amount of spare delegates
    expect(turmoil.getAvailableDelegateCount(player.id)).eq(2); // 1 Reserve + 1 Lobby
    expect(turmoil.delegateReserve.has(player.id)).is.true;
    expect(turmoil.chairman).eq(player.id);


    // Send 3 Neutral delegates
    // This creates at least 3 deferredActions, with possible extra deferredActions for logging
    expect(game.deferredActions.length).is.greaterThanOrEqual(3);

    while (game.deferredActions.length) {
      const selectParty = game.deferredActions.pop()!.execute() as SelectPartyToSendDelegate;
      if (selectParty !== undefined) {
        selectParty.cb(PartyName.GREENS);
      }
    }

    expect(greens.delegates.count('NEUTRAL')).eq(3);

  });

  it('Takes OPG action - all 7 delegates used (including lobby)', function() {
    // Add two more neut delegates to Scientists, now 6 + 1 neut chairman (7 neut total)
    turmoil.sendDelegateToParty("NEUTRAL", scientists.name, game);
    turmoil.sendDelegateToParty("NEUTRAL", scientists.name, game);

    // Replace 6 delegates + chairman
    card.action(player);
    expect(turmoil.getAvailableDelegateCount(player.id)).eq(0);
    expect(turmoil.delegateReserve.has(player.id)).is.false;
    expect(turmoil.chairman).eq(player.id);
    
    expect(scientists.delegates.count(player.id)).eq(4);
    expect(scientists.partyLeader).eq(player.id);

    expect(greens.delegates.count(player.id)).eq(1);
    expect(greens.partyLeader).eq(player.id);

    expect(reds.delegates.count(player.id)).eq(1);
    expect(reds.partyLeader).eq(player.id);

    // We should have been paid 3MC for every swap, 7*3 total
    expect(player.megaCredits).to.eq(21);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
