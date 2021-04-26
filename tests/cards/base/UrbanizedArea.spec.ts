import {expect} from 'chai';
import {UrbanizedArea} from '../../../src/cards/base/UrbanizedArea';
import {Game} from '../../../src/Game';
import {ISpace} from '../../../src/boards/ISpace';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {SpaceName} from '../../../src/SpaceName';
import {SpaceType} from '../../../src/SpaceType';
import {TestPlayers} from '../../TestPlayers';

describe('UrbanizedArea', function() {
  let card : UrbanizedArea; let player : Player; let game : Game; let lands: ISpace[];

  beforeEach(function() {
    card = new UrbanizedArea();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);

    const tharsisTholus = game.board.getSpace(SpaceName.THARSIS_THOLUS);
    lands = game.board.getAdjacentSpaces(tharsisTholus).filter((space) => space.spaceType === SpaceType.LAND);
  });

  it('Can\'t play without energy production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can\'t play without available space between two cities', function() {
    game.addCityTile(player, lands[0].id);
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    game.addCityTile(player, lands[0].id);
    game.addCityTile(player, lands[1].id);

    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action).is.not.undefined;
    expect(action.availableSpaces).has.lengthOf(1);

    action.cb(action.availableSpaces[0]);
    expect(game.getCitiesInPlay()).to.eq(3);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
