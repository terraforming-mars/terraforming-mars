import {expect} from 'chai';
import {AsteroidResources} from '../../../src/cards/pathfinders/AsteroidResources';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {PlaceOceanTile} from '../../../src/deferredActions/PlaceOceanTile';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';

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

    const options = card.play(player) as OrOptions;
    options.options[0].cb();
    expect(player.energy).eq(0);
    expect(player.getProduction(Resources.TITANIUM)).eq(1);
    expect(player.getProduction(Resources.STEEL)).eq(1);
    expect(player.titanium).eq(0);
    expect(player.steel).eq(0);
  });

  it('play, place ocean', function() {
    player.energy = 3;

    const options = card.play(player) as OrOptions;
    options.options[1].cb();
    expect(player.energy).eq(0);
    expect(player.getProduction(Resources.TITANIUM)).eq(0);
    expect(player.getProduction(Resources.STEEL)).eq(0);
    expect(player.titanium).eq(1);
    expect(player.steel).eq(2);
    const action = player.game.deferredActions.peek()! as PlaceOceanTile;
    const select = action.execute() as SelectSpace;
    const space = select.availableSpaces[0];

    expect(space.spaceType).eq(SpaceType.OCEAN);
    expect(space.tile).is.undefined;

    select.cb(space);

    expect(space.tile?.tileType).eq(TileType.OCEAN);
  });
});
