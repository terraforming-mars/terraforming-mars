import {expect} from 'chai';
import {AsteroidResources} from '../../../src/server/cards/pathfinders/AsteroidResources';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {PlaceOceanTile} from '../../../src/server/deferredActions/PlaceOceanTile';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {cast} from '../../TestingUtils';

describe('AsteroidResources', function() {
  let card: AsteroidResources;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AsteroidResources();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('canPlay', function() {
    player.energy = 2;
    expect(player.canPlayIgnoringCost(card)).is.false;
    player.energy = 3;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('play, gain production', function() {
    player.energy = 3;

    const options = cast(card.play(player), OrOptions);
    options.options[0].cb();
    expect(player.energy).eq(0);
    expect(player.production.titanium).eq(1);
    expect(player.production.steel).eq(1);
    expect(player.titanium).eq(0);
    expect(player.steel).eq(0);
  });

  it('play, place ocean', function() {
    player.energy = 3;

    const options = cast(card.play(player), OrOptions);
    options.options[1].cb();
    expect(player.energy).eq(0);
    expect(player.production.titanium).eq(0);
    expect(player.production.steel).eq(0);
    expect(player.titanium).eq(1);
    expect(player.steel).eq(2);
    const action = cast(player.game.deferredActions.peek(), PlaceOceanTile);
    const select = cast(action.execute(), SelectSpace);
    const space = select.availableSpaces[0];

    expect(space.spaceType).eq(SpaceType.OCEAN);
    expect(space.tile).is.undefined;

    select.cb(space);

    expect(space.tile?.tileType).eq(TileType.OCEAN);
  });
});
