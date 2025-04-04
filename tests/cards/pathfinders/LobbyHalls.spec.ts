import {expect} from 'chai';
import {LobbyHalls} from '../../../src/server/cards/pathfinders/LobbyHalls';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {IGame} from '../../../src/server/IGame';
import {DeclareCloneTag} from '../../../src/server/pathfinders/DeclareCloneTag';
import {Tag} from '../../../src/common/cards/Tag';
import {IDeferredAction} from '../../../src/server//deferredActions/DeferredAction';
import {cast} from '../../TestingUtils';
import {assertAddDelegateAction} from '../../turmoil/turmoilAssertions';

describe('LobbyHalls', () => {
  let card: LobbyHalls;
  let game: IGame;
  let player: TestPlayer;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new LobbyHalls();
    [game, player] = testGame(1, {turmoilExtension: true, pathfindersExpansion: true});
    turmoil = game.turmoil!;
  });

  it('cannot play, not enough delegates', () => {
    turmoil.delegateReserve.clear();
    expect(card.tags).deep.eq([Tag.CLONE, Tag.BUILDING]);

    expect(card.canPlay(player)).is.false;
  });

  it('play', () => {
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });

  it('play, has a delegate', () => {
    expect(turmoil.getAvailableDelegateCount(player)).eq(7);
    expect(card.tags).deep.eq([Tag.CLONE, Tag.BUILDING]);

    card.play(player);

    expect(game.deferredActions).has.length(2);

    // First action is define a clone tag
    assertCloneTagAction(game.deferredActions.pop()!);

    // Next test adds a delegate.
    assertAddDelegateAction(player, game.deferredActions.pop()?.execute());
  });

  function assertCloneTagAction(action: IDeferredAction) {
    const options = cast(action, DeclareCloneTag).execute();
    options.options[1].cb();
    expect(card.tags).deep.eq([Tag.EARTH, Tag.BUILDING]);
  }
});
