import {expect} from 'chai';
import {LobbyHalls} from '../../../src/cards/pathfinders/LobbyHalls';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {Game} from '../../../src/Game';
import {DeclareCloneTag} from '../../../src/pathfinders/DeclareCloneTag';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Tags} from '../../../src/common/cards/Tags';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {DeferredAction} from '../../../src//deferredActions/DeferredAction';
import {SendDelegateToArea} from '../../../src//deferredActions/SendDelegateToArea';
import {SelectPartyToSendDelegate} from '../../../src//inputs/SelectPartyToSendDelegate';

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
    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 2}));
  });

  it('play, not enough delegates', () => {
    turmoil.delegateReserve = [];
    expect(card.tags).deep.eq([Tags.CLONE, Tags.BUILDING]);

    card.play(player);

    // Only one available action
    expect(game.deferredActions.length).eq(1);

    // First action is define a clone tag
    assertCloneTagAction(game.deferredActions.pop()!);
  });

  it('play, has a delegate', () => {
    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(6);
    expect(card.tags).deep.eq([Tags.CLONE, Tags.BUILDING]);

    card.play(player);

    expect(game.deferredActions.length).eq(2);

    // First action is define a clone tag
    assertCloneTagAction(game.deferredActions.pop()!);

    // Next test adds a delegate.
    // This test is brittle - it assumes mars first will be orOptions[0]. But OK.
    assertAddDelegateAction(game.deferredActions.pop()!);
  });

  function assertCloneTagAction(action: DeferredAction) {
    expect(action).instanceOf(DeclareCloneTag);
    const options = action!.execute() as OrOptions;
    options.options[0].cb();
    expect(card.tags).deep.eq([Tags.EARTH, Tags.BUILDING]);
  }

  function assertAddDelegateAction(action: DeferredAction) {
    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(6);
    expect(marsFirst.getDelegates(player.id)).eq(0);

    expect(action).instanceOf(SendDelegateToArea);
    const options = action.execute()! as SelectPartyToSendDelegate;
    options.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(5);
    expect(marsFirst.getDelegates(player.id)).eq(1);
  }
});
