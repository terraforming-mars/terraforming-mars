import {expect} from 'chai';
import {LobbyHalls} from '../../../src/server/cards/pathfinders/LobbyHalls';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {Game} from '../../../src/server/Game';
import {DeclareCloneTag} from '../../../src/server/pathfinders/DeclareCloneTag';
import {Tag} from '../../../src/common/cards/Tag';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {IDeferredAction} from '../../../src/server//deferredActions/DeferredAction';
import {SendDelegateToArea} from '../../../src/server//deferredActions/SendDelegateToArea';
import {SelectParty} from '../../../src/server//inputs/SelectParty';
import {cast} from '../../TestingUtils';

describe('LobbyHalls', function() {
  let card: LobbyHalls;
  let game: Game;
  let player: TestPlayer;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new LobbyHalls();
    [game, player] = testGame(1, {turmoilExtension: true, pathfindersExpansion: true});
    turmoil = game.turmoil!;
  });

  it('cannot play, not enough delegates', () => {
    turmoil.delegateReserve.clear();
    expect(card.tags).deep.eq([Tag.CLONE, Tag.BUILDING]);

    expect(card.canPlay(player)).is.false;
  });

  it('play', function() {
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });

  it('play, has a delegate', () => {
    expect(turmoil.getAvailableDelegateCount(player)).eq(7);
    expect(card.tags).deep.eq([Tag.CLONE, Tag.BUILDING]);

    card.play(player);

    expect(game.deferredActions.length).eq(2);

    // First action is define a clone tag
    assertCloneTagAction(game.deferredActions.pop()!);

    // Next test adds a delegate.
    assertAddDelegateAction(cast(game.deferredActions.pop(), SendDelegateToArea));
  });

  function assertCloneTagAction(action: IDeferredAction) {
    const options = cast(action, DeclareCloneTag).execute();
    options.options[0].cb();
    expect(card.tags).deep.eq([Tag.EARTH, Tag.BUILDING]);
  }

  function assertAddDelegateAction(action: SendDelegateToArea) {
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);

    expect(turmoil.getAvailableDelegateCount(player)).eq(7);
    expect(marsFirst.delegates.get(player)).eq(0);

    const options = cast(action.execute(), SelectParty);
    options.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player)).eq(6);
    expect(marsFirst.delegates.get(player)).eq(1);
  }
});
