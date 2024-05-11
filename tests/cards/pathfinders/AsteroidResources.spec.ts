import {expect} from 'chai';
import {AsteroidResources} from '../../../src/server/cards/pathfinders/AsteroidResources';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {PlaceOceanTile} from '../../../src/server/deferredActions/PlaceOceanTile';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions} from '../../TestingUtils';

describe('AsteroidResources', function() {
  let card: AsteroidResources;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new AsteroidResources();
    [game, player] = testGame(1);
  });

  it('canPlay', function() {
    player.energy = 2;
    expect(card.canPlay(player)).is.false;
    player.energy = 3;
    expect(card.canPlay(player)).is.true;
  });

  it('play, gain production', function() {
    player.energy = 3;

    card.play(player);
    runAllActions(game);
    const options = cast(player.popWaitingFor(), OrOptions);
    options.options[0].cb();
    expect(player.energy).eq(0);
    expect(player.production.titanium).eq(1);
    expect(player.production.steel).eq(1);
    expect(player.titanium).eq(0);
    expect(player.steel).eq(0);
  });

  it('play, place ocean', function() {
    player.energy = 3;

    card.play(player);
    runAllActions(game);
    const options = cast(player.popWaitingFor(), OrOptions);
    options.options[1].cb();
    expect(player.energy).eq(0);
    expect(player.production.titanium).eq(0);
    expect(player.production.steel).eq(0);
    expect(player.titanium).eq(1);
    expect(player.steel).eq(2);
    const action = cast(player.game.deferredActions.peek(), PlaceOceanTile);
    const select = cast(action.execute(), SelectSpace);
    const space = select.spaces[0];

    expect(space.spaceType).eq(SpaceType.OCEAN);
    expect(space.tile).is.undefined;

    select.cb(space);

    expect(space.tile?.tileType).eq(TileType.OCEAN);
  });
});
