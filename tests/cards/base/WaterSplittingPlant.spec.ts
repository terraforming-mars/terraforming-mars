import {expect} from 'chai';
import {WaterSplittingPlant} from '../../../src/server/cards/base/WaterSplittingPlant';
import {Game} from '../../../src/server/Game';
import {maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('WaterSplittingPlant', function() {
  let card: WaterSplittingPlant;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new WaterSplittingPlant();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', function() {
    maxOutOceans(player, 2);
    expect(card.canPlay(player)).is.true;
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
