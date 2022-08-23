import {expect} from 'chai';
import {SpacePort} from '../../../src/server/cards/colonies/SpacePort';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Player} from '../../../src/server/Player';
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
    player.production.add(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play without energy production', function() {
    const colony = new Ceres();
    colony.colonies.push(player.id);
    player.game.colonies.push(colony);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    const colony = new Ceres();
    colony.colonies.push(player.id);
    player.game.colonies.push(colony);
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), SelectSpace);
    action.cb(action.availableSpaces[0]);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(4);
  });
});
