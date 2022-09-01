import {expect} from 'chai';
import {UrbanizedArea} from '../../../src/server/cards/base/UrbanizedArea';
import {Game} from '../../../src/server/Game';
import {ISpace} from '../../../src/server/boards/ISpace';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {SpaceName} from '../../../src/server/SpaceName';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast} from '../../TestingUtils';

describe('UrbanizedArea', function() {
  let card: UrbanizedArea;
  let player: Player;
  let game: Game;
  let lands: ISpace[];

  beforeEach(function() {
    card = new UrbanizedArea();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);

    const tharsisTholus = game.board.getSpace(SpaceName.THARSIS_THOLUS);
    lands = game.board.getAdjacentSpaces(tharsisTholus).filter((space) => space.spaceType === SpaceType.LAND);
  });

  it('Can not play without energy production', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Can not play without available space between two cities', function() {
    game.addCityTile(player, lands[0].id);
    player.production.add(Resources.ENERGY, 1);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    game.addCityTile(player, lands[0].id);
    game.addCityTile(player, lands[1].id);

    player.production.add(Resources.ENERGY, 1);
    expect(player.simpleCanPlay(card)).is.true;

    const action = cast(card.play(player), SelectSpace);
    expect(action.availableSpaces).has.lengthOf(1);

    action.cb(action.availableSpaces[0]);
    expect(game.getCitiesCount()).to.eq(3);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(2);
  });
});
