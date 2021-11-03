import {expect} from 'chai';
import {DeclarationOfIndependence} from '../../../src/cards/pathfinders/DeclarationOfIndependence';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {SendDelegateToArea} from '../../../src/deferredActions/SendDelegateToArea';

describe('DeclarationOfIndependence', function() {
  let card: DeclarationOfIndependence;
  let player: TestPlayer;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new DeclarationOfIndependence();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions());
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
    const action = player.game.deferredActions.pop() as SendDelegateToArea;
    const options = action.execute();
    options!.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(4);
    expect(marsFirst.getDelegates(player.id)).eq(2);
  });
});
