import {expect} from 'chai';
import {WaterSplittingPlant} from '../../../src/server/cards/base/WaterSplittingPlant';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('WaterSplittingPlant', function() {
  let card: WaterSplittingPlant;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new WaterSplittingPlant();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', function() {
    maxOutOceans(player, 2);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Can not act', function() {
    player.energy = 2;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 3;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
