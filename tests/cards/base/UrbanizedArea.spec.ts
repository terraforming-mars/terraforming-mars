import {expect} from 'chai';
import {UrbanizedArea} from '../../../src/server/cards/base/UrbanizedArea';
import {Game} from '../../../src/server/Game';
import {Space} from '../../../src/server/boards/Space';
import {Resource} from '../../../src/common/Resource';
import {SpaceName} from '../../../src/server/SpaceName';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('UrbanizedArea', function() {
  let card: UrbanizedArea;
  let player: TestPlayer;
  let game: Game;
  let lands: Space[];

  beforeEach(function() {
    card = new UrbanizedArea();
    [game, player] = testGame(2);

    const tharsisTholus = game.board.getSpaceOrThrow(SpaceName.THARSIS_THOLUS);
    lands = game.board.getAdjacentSpaces(tharsisTholus).filter((space) => space.spaceType === SpaceType.LAND);
  });

  it('Can not play without energy production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play without available space between two cities', function() {
    game.addCity(player, lands[0]);
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    game.addCity(player, lands[0]);
    game.addCity(player, lands[1]);

    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), SelectSpace);
    expect(action.spaces).has.lengthOf(1);

    action.cb(action.spaces[0]);
    expect(game.board.getCities()).has.length(3);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(2);
  });
});
