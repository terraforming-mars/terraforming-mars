import {expect} from 'chai';
import {DeclarationOfIndependence} from '../../../src/server/cards/pathfinders/DeclarationOfIndependence';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, testGameOptions} from '../../TestingUtils';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {SelectPartyToSendDelegate} from '../../../src/server/inputs/SelectPartyToSendDelegate';

describe('DeclarationOfIndependence', function() {
  let card: DeclarationOfIndependence;
  let player: TestPlayer;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new DeclarationOfIndependence();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({turmoilExtension: true}));
    turmoil = player.game.turmoil!;
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;

    player.tagsForTest = {mars: 5};
    expect(player.canPlay(card)).is.false;

    player.tagsForTest = {mars: 6};
    expect(player.canPlay(card)).is.true;

    turmoil.delegateReserve = [];
    expect(player.canPlay(card)).is.false;
  });


  it('play', function() {
    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(6);
    // This test is brittle - it assumes mars first will be orOptions[0]. But OK.
    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;
    expect(marsFirst.getDelegates(player.id)).eq(0);
    card.play(player);
    runAllActions(player.game);
    const action = cast(player.getWaitingFor(), SelectPartyToSendDelegate);
    action.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(4);
    expect(marsFirst.getDelegates(player.id)).eq(2);
  });
});
