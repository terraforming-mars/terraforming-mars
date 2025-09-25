import {expect} from 'chai';
import {DeclarationOfIndependence} from '../../../src/server/cards/pathfinders/DeclarationOfIndependence';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, testGame} from '../../TestingUtils';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {SelectParty} from '../../../src/server/inputs/SelectParty';

describe('DeclarationOfIndependence', () => {
  let card: DeclarationOfIndependence;
  let player: TestPlayer;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new DeclarationOfIndependence();
    [/* game */, player] = testGame(1, {turmoilExtension: true});
    turmoil = player.game.turmoil!;
  });

  it('canPlay', () => {
    player.megaCredits = card.cost;

    player.tagsForTest = {mars: 5};
    expect(player.canPlay(card)).is.false;

    player.tagsForTest = {mars: 6};
    expect(player.canPlay(card)).is.true;

    turmoil.delegateReserve.clear();
    expect(player.canPlay(card)).is.false;
  });


  it('play', () => {
    expect(turmoil.getAvailableDelegateCount(player)).eq(7);
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    expect(marsFirst.delegates.get(player)).eq(0);
    card.play(player);
    runAllActions(player.game);
    const action = cast(player.getWaitingFor(), SelectParty);
    action.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player)).eq(5);
    expect(marsFirst.delegates.get(player)).eq(2);
  });
});
