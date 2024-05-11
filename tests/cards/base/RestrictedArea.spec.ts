import {expect} from 'chai';
import {RestrictedArea} from '../../../src/server/cards/base/RestrictedArea';
import {IGame} from '../../../src/server/IGame';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('RestrictedArea', function() {
  let card: RestrictedArea;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new RestrictedArea();
    [game, player] = testGame(2);
  });

  it('Can not act if not enough MC', function() {
    player.megaCredits = 1;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should play', function() {
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);

    expect(space.tile?.tileType).to.eq(TileType.RESTRICTED_AREA);
    expect(space.adjacency?.bonus).eq(undefined);
  });

  it('Should act', function() {
    player.megaCredits = 2;
    expect(card.canAct(player)).is.true;
    card.action(player);

    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
