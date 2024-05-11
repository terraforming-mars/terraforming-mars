import {expect} from 'chai';
import {IndustrialCenter} from '../../../src/server/cards/base/IndustrialCenter';
import {IGame} from '../../../src/server/IGame';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {addCity, cast} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('IndustrialCenter', function() {
  let card: IndustrialCenter;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new IndustrialCenter();
    [game, player] = testGame(2);
  });

  it('Can not play or act', function() {
    expect(card.canAct(player)).is.not.true;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should action', function() {
    player.megaCredits = 7;
    card.action(player);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.production.steel).to.eq(1);
  });

  it('Should play', function() {
    addCity(player);
    expect(game.board.getCitiesOnMars()).has.length(1);

    const action = cast(card.play(player), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);
    expect(space.tile?.tileType).to.eq(TileType.INDUSTRIAL_CENTER);
    expect(space.adjacency?.bonus).eq(undefined);
  });
});
