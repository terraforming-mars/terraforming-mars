import {expect} from 'chai';
import {Pallas} from '../../../src/server/cards/community/Pallas';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {SelectPartyToSendDelegate} from '../../../src/server/inputs/SelectPartyToSendDelegate';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {IParty} from '../../../src/server/turmoil/parties/IParty';

describe('Pallas', function() {
  let pallas: Pallas;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;
  let greens: IParty;
  let scientists: IParty;

  beforeEach(function() {
    pallas = new Pallas();
    [game, player, player2] = testGame(2, {turmoilExtension: true, coloniesExtension: true});
    game.colonies.push(pallas);
    turmoil = Turmoil.getTurmoil(game);
    greens = turmoil.getPartyByName(PartyName.GREENS);
    scientists = turmoil.getPartyByName(PartyName.SCIENTISTS);

    greens.delegates.clear();
    scientists.delegates.clear();
  });

  it('Should build', function() {
    expect(turmoil.getPlayerInfluence(player)).eq(0);
    expect(turmoil.getPlayerInfluence(player2)).eq(0);
    pallas.addColony(player);
    expect(turmoil.getPlayerInfluence(player)).eq(1);
    expect(turmoil.getPlayerInfluence(player2)).eq(0);
    pallas.addColony(player);
    expect(turmoil.getPlayerInfluence(player)).eq(2);
    expect(turmoil.getPlayerInfluence(player2)).eq(0);
    pallas.addColony(player2);
    expect(turmoil.getPlayerInfluence(player)).eq(2);
    expect(turmoil.getPlayerInfluence(player2)).eq(1);
  });

  it('Should trade', function() {
    pallas.trackPosition = 4; // Send 2 delegates
    pallas.trade(player);

    expect(greens.delegates.size).eq(0);
    expect(scientists.delegates.size).eq(0);

    runAllActions(game);

    const selectParty = cast(player.popWaitingFor(), SelectPartyToSendDelegate);
    selectParty.cb(PartyName.GREENS);
    expect(Array.from(greens.delegates.values())).deep.eq([player.id]);
    expect(scientists.delegates.size).eq(0);

    runAllActions(game);

    const selectParty2 = cast(player.popWaitingFor(), SelectPartyToSendDelegate);
    selectParty2.cb(PartyName.SCIENTISTS);

    expect(Array.from(greens.delegates.values())).deep.eq([player.id]);
    expect(Array.from(scientists.delegates.values())).deep.eq([player.id]);

    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
  });

  it('Should give trade bonus', function() {
    pallas.addColony(player);
    player.megaCredits = 0;
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
    pallas.trade(player2); // player2 is trading. But player(1) is getting the MC
    runAllActions(game);
    const sendDelegates = cast(player2.popWaitingFor(), SelectPartyToSendDelegate);
    sendDelegates.cb(PartyName.REDS);
    runAllActions(game);

    expect(player.megaCredits).eq(3);
  });

  it('Colony benefit occurs after trade bonus', function() {
    pallas.addColony(player);
    player.megaCredits = 0;
    pallas.trackPosition = 2; // Send 1 delegate
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
    pallas.trade(player); // player(1) is trading and gaining the mc.
    runAllActions(game);
    const sendDelegates = cast(player.popWaitingFor(), SelectPartyToSendDelegate);
    sendDelegates.cb(PartyName.REDS);
    runAllActions(game);

    expect(player.megaCredits).eq(4);
  });
});
