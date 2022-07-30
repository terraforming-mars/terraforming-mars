import {expect} from 'chai';
import {SpacePort} from '../../../src/cards/colonies/SpacePort';
import {Ceres} from '../../../src/colonies/Ceres';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('SpacePort', function() {
  let card: SpacePort;
  let player: Player;

  beforeEach(function() {
    card = new SpacePort();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play without colony', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play without energy production', function() {
    const colony = new Ceres();
    colony.colonies.push(player.id);
    player.game.colonies.push(colony);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    const colony = new Ceres();
    colony.colonies.push(player.id);
    player.game.colonies.push(colony);
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), SelectSpace);
    action.cb(action.availableSpaces[0]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });
});
