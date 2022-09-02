import {expect} from 'chai';
import {LobbyHalls} from '../../../src/server/cards/pathfinders/LobbyHalls';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {Game} from '../../../src/server/Game';
import {DeclareCloneTag} from '../../../src/server/pathfinders/DeclareCloneTag';
import {Tag} from '../../../src/common/cards/Tag';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {DeferredAction} from '../../../src/server//deferredActions/DeferredAction';
import {SendDelegateToArea} from '../../../src/server//deferredActions/SendDelegateToArea';
import {SelectPartyToSendDelegate} from '../../../src/server//inputs/SelectPartyToSendDelegate';
import {cast} from '../../TestingUtils';

describe('LobbyHalls', function() {
  let card: LobbyHalls;
  let game: Game;
  let player: TestPlayer;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new LobbyHalls();
    game = newTestGame(1, {turmoilExtension: true, pathfindersExpansion: true});
    player = getTestPlayer(game, 0);
    turmoil = game.turmoil!;
  });

  it('play', function() {
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });

  it('play, not enough delegates', () => {
    turmoil.delegateReserve = [];
    expect(card.tags).deep.eq([Tag.CLONE, Tag.BUILDING]);

    card.play(player);

    // Only one available action
    expect(game.deferredActions.length).eq(1);

    // First action is define a clone tag
    assertCloneTagAction(game.deferredActions.pop()!);
  });

  it('play, has a delegate', () => {
    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(6);
    expect(card.tags).deep.eq([Tag.CLONE, Tag.BUILDING]);

    card.play(player);

    expect(game.deferredActions.length).eq(2);

    // First action is define a clone tag
    assertCloneTagAction(game.deferredActions.pop()!);

    // Next test adds a delegate.
    // This test is brittle - it assumes mars first will be orOptions[0]. But OK.
    assertAddDelegateAction(cast(game.deferredActions.pop(), SendDelegateToArea));
  });

  function assertCloneTagAction(action: DeferredAction) {
    const options = cast(action, DeclareCloneTag).execute();
    options.options[0].cb();
    expect(card.tags).deep.eq([Tag.EARTH, Tag.BUILDING]);
  }

  function assertAddDelegateAction(action: SendDelegateToArea) {
    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(6);
    expect(marsFirst.getDelegates(player.id)).eq(0);

    const options = cast(action.execute(), SelectPartyToSendDelegate);
    options.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(5);
    expect(marsFirst.getDelegates(player.id)).eq(1);
  }
});
